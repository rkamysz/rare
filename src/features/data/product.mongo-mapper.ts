import * as Soap from "@soapjs/soap";
import * as MongoDb from "mongodb";

import { ProductMongoDocument } from "./dtos";
import { Product } from "../domain/entities/product";

export class ProductMongoMapper
  implements Soap.Mapper<Product, ProductMongoDocument>
{
  fromEntity(entity: Product): ProductMongoDocument {
    const {
      id,
      vintage,
      producerId,
      name,
      colour,
      quantity,
      format,
      priceGBP,
      duty,
      availability,
      conditions,
      imageUrl,
    } = entity;
    return {
      _id: new MongoDb.ObjectId(id),
      vintage,
      name,
      producerId: new MongoDb.ObjectId(producerId),
      colour,
      quantity,
      format,
      priceGBP,
      duty,
      availability,
      conditions,
      imageUrl,
    };
  }

  toEntity(model: ProductMongoDocument): Product {
    const {
      _id,
      name,
      vintage,
      producerId,
      colour,
      quantity,
      format,
      priceGBP,
      duty,
      availability,
      conditions,
      imageUrl,
    } = model;

    return new Product(
      _id.toString(),
      vintage,
      name,
      producerId.toString(),
      colour,
      quantity,
      format,
      priceGBP,
      duty,
      availability,
      conditions,
      imageUrl
    );
  }
}
