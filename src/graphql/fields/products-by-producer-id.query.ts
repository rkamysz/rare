import { HttpError, Result } from "@soapjs/soap";
import { Container } from "inversify";
import { FieldIO, GraphField } from "../../core";
import { Product } from "../../features/domain/entities/product";
import { ProductsController } from "../../features/domain/products.controller";
import { ListProductsOptions } from "../../features/domain/types";
import { ProductModel } from "../models";
import {
  ProducerNotFoundError,
  ProductNotFoundError,
} from "../../features/domain/errors";
import { createProductWithProducerModel } from "./product.query";

export class ProductsByProducerIdQueryIO implements FieldIO {
  fromType(type: { producerId: string }): ListProductsOptions {
    return { producerId: type.producerId };
  }

  toResponse(result: Result<Product[]>): ProductModel[] | HttpError {
    if (
      result.isFailure &&
      (result.failure.error instanceof ProductNotFoundError ||
        result.failure.error instanceof ProducerNotFoundError)
    ) {
      return new HttpError(404, result.failure.error.message);
    }

    if (result.isFailure) {
      // log this error
      return new HttpError(500, result.failure.error.message);
    }

    return result.content.map((product) =>
      createProductWithProducerModel(product)
    );
  }
}

export class ProductsByProducerIdQuery extends GraphField<ProductModel[]> {
  static create(container: Container): GraphField<ProductModel[]> {
    const products = container.get<ProductsController>(
      ProductsController.Token
    );

    return new GraphField<ProductModel[]>(
      "query",
      "productsByProducerId",
      products.list.bind(products),
      new ProductsByProducerIdQueryIO()
    );
  }
}
