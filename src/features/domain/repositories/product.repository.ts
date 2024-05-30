import * as Soap from "@soapjs/soap";
import { Product } from "../entities/product";
import { injectable } from "inversify";

@injectable()
export abstract class ProductRepository extends Soap.Repository<Product> {
  static Token = "ProductRepository";
}
