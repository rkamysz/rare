/* eslint-disable @typescript-eslint/no-explicit-any */

import { Container } from "inversify";
import { FieldIO, GraphField } from "../../core";
import { ProductsController } from "../../features/domain/products.controller";
import { ProductModel } from "../models";
import { Product } from "../../features/domain/entities/product";
import { HttpError, Result } from "@soapjs/soap";
import { createProductWithProducerModel } from "./product.query";

export type EditProduct = {
  vintage: string;
  name: string;
  producerId: string;
};

export class UpdateProductMutationIO implements FieldIO {
  fromType(type: { _id: string; update: EditProduct }): Product {
    return new Product(
      type._id,
      type.update.vintage,
      type.update.name,
      type.update.producerId
    );
  }

  toResponse(result: Result<Product>): ProductModel | HttpError {
    if (result.isFailure) {
      // log this error
      return new HttpError(500, result.failure.error.message);
    }

    return createProductWithProducerModel(result.content);
  }
}

export class UpdateProductMutation extends GraphField<EditProduct> {
  static create(container: Container): GraphField<EditProduct> {
    const products = container.get<ProductsController>(
      ProductsController.Token
    );

    return new GraphField<EditProduct>(
      "mutation",
      "updateProduct",
      products.update.bind(products),
      new UpdateProductMutationIO()
    );
  }
}
