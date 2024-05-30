import { HttpError, Result } from "@soapjs/soap";
import { Container } from "inversify";
import { FieldIO, GraphField } from "../../core";
import { ProductsController } from "../../features/domain/products.controller";
import { Product } from "../../features/domain/entities/product";
import { ProductModel } from "../models";
import { createProductWithProducerModel } from "./product.query";

export type NewProduct = {
  vintage: string;
  name: string;
  producerId: string;
};

export class CreateProductsMutationIO implements FieldIO {
  fromType(type: { products: NewProduct[] }): Product[] {
    return type.products.map(
      (input) =>
        new Product(undefined, input.vintage, input.name, input.producerId)
    );
  }

  toResponse(result: Result<Product[]>): ProductModel[] | HttpError {
    if (result.isFailure) {
      // log this error
      return new HttpError(500, result.failure.error.message);
    }

    return result.content.map((product) =>
      createProductWithProducerModel(product)
    );
  }
}

export class CreateProductsMutation extends GraphField<ProductModel[]> {
  static create(container: Container): GraphField<ProductModel[]> {
    const products = container.get<ProductsController>(
      ProductsController.Token
    );

    return new GraphField<ProductModel[]>(
      "mutation",
      "createProducts",
      products.create.bind(products),
      new CreateProductsMutationIO()
    );
  }
}
