import { HttpError, Result } from "@soapjs/soap";
import { Container } from "inversify";
import { FieldIO, GraphField } from "../../core";
import { Product } from "../../features/domain/entities/product";
import { ProductsController } from "../../features/domain/products.controller";
import { ListProductsOptions } from "../../features/domain/types";
import {
  ProducerModel,
  ProductModel,
  ProductWithProducerModel,
} from "../models";
import { ProductNotFoundError } from "../../features/domain/errors";

export const createProductWithProducerModel = (product) => {
  const { id, producer, ...rest } = product;
  let _producer: ProducerModel;

  if (producer) {
    const { id, ...rest } = producer;
    _producer = { _id: id, ...rest };
  } else {
    _producer = {
      _id: null,
      name: "unknown",
      region: "unknown",
      country: "unknown",
    };
  }

  return {
    _id: id,
    producer: _producer,
    ...rest,
  };
};

export class ProductQueryIO implements FieldIO {
  fromType(type: { _id: string }): ListProductsOptions {
    return { id: type._id };
  }

  toResponse(result: Result<Product>): ProductWithProducerModel | HttpError {
    if (
      result.isFailure &&
      result.failure.error instanceof ProductNotFoundError
    ) {
      return new HttpError(404, result.failure.error.message);
    }

    if (result.isFailure) {
      // log this error
      return new HttpError(500, result.failure.error.message);
    }

    return createProductWithProducerModel(result.content);
  }
}

export class ProductQuery extends GraphField<ProductModel> {
  static create(container: Container): GraphField<ProductModel> {
    const products = container.get<ProductsController>(
      ProductsController.Token
    );

    return new GraphField<ProductModel>(
      "query",
      "product",
      products.list.bind(products),
      new ProductQueryIO()
    );
  }
}
