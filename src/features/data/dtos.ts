import * as MongoDb from "mongodb";

export type ProductMongoDocument = {
  _id: MongoDb.ObjectId;
  vintage: string;
  name: string;
  producerId: MongoDb.ObjectId;
  colour: string;
  quantity: number;
  format: string;
  priceGBP: number;
  duty: string;
  availability: string;
  conditions: string;
  imageUrl: string;
};

export type ProducerMongoDocument = {
  _id: MongoDb.ObjectId;
  name: string;
  country: string;
  region: string;
};
