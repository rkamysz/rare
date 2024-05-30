import * as Soap from "@soapjs/soap";
import { Producer } from "../entities/producer";
import { injectable } from "inversify";

@injectable()
export abstract class ProducerRepository extends Soap.Repository<Producer> {
  static Token = "ProducerRepository";
}
