/* eslint-disable @typescript-eslint/no-explicit-any */

import { parentPort, workerData } from "worker_threads";
import fs from "fs";
import https from "https";
import csv from "csv-parser";
import { MongoClient, ObjectId } from "mongodb";
import * as Soap from "@soapjs/soap";
import { ProducerMongoDocument, ProductMongoDocument } from "./dtos";
import { Readable } from "stream";
import { finished } from "stream/promises";

const config = new Soap.ConfigVars();
const replicaSet = config.getStringEnv("DB_REPLICA_SET");
const dbName = config.getStringEnv("DB_NAME");
const url = `mongodb://${config.getStringEnv("DB_HOST")}:${config.getStringEnv(
  "DB_PORT"
)}${replicaSet ? "/replicaSet=" + replicaSet : ""}`;
const client = new MongoClient(url);

const createCsvStream = async (source: string): Promise<Readable> => {
  return new Promise((resolve, reject) => {
    if (source.startsWith("http://") || source.startsWith("https://")) {
      https
        .get(source, (response) => {
          if (response.statusCode === 200) {
            resolve(response);
          } else {
            reject(
              new Error(`Failed to get '${source}' (${response.statusCode})`)
            );
          }
        })
        .on("error", (error) => {
          reject(error);
        });
    } else {
      fs.access(source, fs.constants.R_OK, (err) => {
        if (err) {
          reject(new Error(`File '${source}' cannot be read`));
        } else {
          resolve(fs.createReadStream(source));
        }
      });
    }
  });
};

async function insertBatch(
  db: any,
  productMap: { [key: string]: ProductMongoDocument },
  producerMap: { [key: string]: ProducerMongoDocument }
) {
  const batchProductMap = { ...productMap };
  const batchProducerMap = { ...producerMap };

  Object.keys(productMap).forEach((key) => delete productMap[key]);
  Object.keys(producerMap).forEach((key) => delete producerMap[key]);

  const producers = Object.values(batchProducerMap);
  const products = Object.values(batchProductMap);

  const producerBulkOps = producers.map((producer) => ({
    insertOne: {
      document: producer,
    },
  }));

  const productBulkOps = products.map((product) => ({
    insertOne: {
      document: product,
    },
  }));

  if (producerBulkOps.length > 0) {
    try {
      await db.collection("producers").bulkWrite(producerBulkOps);
    } catch (error) {
      if (error.code !== 11000) {
        console.error("Error during bulk insert producers:", error);
      }
    }
  }

  if (productBulkOps.length > 0) {
    try {
      await db.collection("products").bulkWrite(productBulkOps);
    } catch (error) {
      if (error.code !== 11000) {
        console.error("Error during bulk insert products:", error);
      }
    }
  }
}

const appendMaps = (row, producerMap, productMap) => {
  const producerKey = `${row.Producer}-${row.Country}-${row.Region}`;
  if (!producerMap[producerKey]) {
    producerMap[producerKey] = {
      _id: new ObjectId(),
      name: row.Producer,
      country: row.Country,
      region: row.Region,
    };
  }

  const key = `${row.Vintage}-${row["Product Name"]}-${row.Producer}`;
  if (!productMap[key]) {
    productMap[key] = {
      _id: new ObjectId(),
      vintage: row.Vintage,
      name: row["Product Name"],
      producerId: producerMap[producerKey]._id,
      colour: row.Colour,
      quantity: parseInt(row.Quantity),
      format: row.Format,
      priceGBP: parseFloat(row["Price (GBP)"]),
      duty: row.Duty,
      availability: row.Availability,
      conditions: row.Conditions,
      imageUrl: row.ImageUrl,
    };
  }
};

const upsertProductsFromCSV = async (
  filePath: string,
  batchSize: number
): Promise<void> => {
  let stream;
  try {
    const insertPromises = [];
    const productMap: { [key: string]: ProductMongoDocument } = {};
    const producerMap: { [key: string]: ProducerMongoDocument } = {};
    await client.connect();
    const db = client.db(dbName);
    stream = await createCsvStream(filePath);

    stream.pipe(csv()).on("data", async (row) => {
      stream.pause();
      appendMaps(row, producerMap, productMap);
      if (Object.keys(productMap).length >= batchSize) {
        insertPromises.push(insertBatch(db, productMap, producerMap));
      }
      stream.resume();
    });
    await finished(stream);

    if (Object.keys(productMap).length > 0) {
      insertPromises.push(insertBatch(db, productMap, producerMap));
    }
    await Promise.all(insertPromises);
    // console.log("CSV file successfully processed");

    parentPort?.postMessage({ success: true });
  } catch (error) {
    // console.error("Error processing CSV:", error);
    parentPort?.postMessage({ success: false, error });
  }
};

if (workerData && workerData.filePath) {
  upsertProductsFromCSV(workerData.filePath, workerData.batchSize || 100);
}
