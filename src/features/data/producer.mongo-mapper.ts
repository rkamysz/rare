import * as Soap from "@soapjs/soap";
import * as MongoDb from "mongodb";

import { ProducerMongoDocument } from "./dtos";
import { Producer } from "../domain/entities/producer";

export class ProducerMongoMapper
  implements Soap.Mapper<Producer, ProducerMongoDocument>
{
  fromEntity(entity: Producer): ProducerMongoDocument {
    const { id, country, region, name } = entity;
    return {
      _id: new MongoDb.ObjectId(id),
      country,
      region,
      name,
    };
  }

  toEntity(model: ProducerMongoDocument): Producer {
    const { _id, country, region, name } = model;
    return new Producer(_id.toString(), name, country, region);
  }
}
