import { Container } from "inversify";
import * as Soap from "@soapjs/soap";
import { MongoSource, SoapMongo } from "@soapjs/soap-node-mongo";

import { ProductsController } from "./features/domain/products.controller";
import { ProductMongoMapper } from "./features/data/product.mongo-mapper";
import {
  ProducerMongoDocument,
  ProductMongoDocument,
} from "./features/data/dtos";
import { ProductRepository } from "./features/domain/repositories/product.repository";
import { ProducerMongoMapper } from "./features/data/producer.mongo-mapper";
import { ProducerRepository } from "./features/domain/repositories/producer.repository";
import { CreateProductsUseCase } from "./features/domain/use-cases/create-products.use-case";
import { UpdateProductUseCase } from "./features/domain/use-cases/update-product.use-case";
import { GetProductByIdUseCase } from "./features/domain/use-cases/get-product-by-id.use-case";
import { GetProductsByProducerIdUseCase } from "./features/domain/use-cases/get-products-by-producer-id.use-case";
import { RemoveProductsUseCase } from "./features/domain/use-cases/remove-products.use-case";
import { AssignProducersUseCase } from "./features/domain/use-cases/assign-producers.use-case";

export class Dependencies implements Soap.Dependencies {
  constructor(public readonly container: Container) {}
  async configure(config: Soap.ConfigVars): Promise<void> {
    const mongoSource = await SoapMongo.create({
      database: config.getStringEnv("DB_NAME"),
      hosts: [config.getStringEnv("DB_HOST")],
      ports: [config.getStringEnv("DB_PORT")],
    });

    console.log("MongoDB connected");

    /**
     * repositories
     */

    const producerRepository = new Soap.RepositoryImpl(
      new Soap.DatabaseContext(
        new MongoSource<ProducerMongoDocument>(mongoSource, "producers"),
        new ProducerMongoMapper()
      )
    );

    const productRepository = new Soap.RepositoryImpl(
      new Soap.DatabaseContext(
        new MongoSource<ProductMongoDocument>(mongoSource, "products"),
        new ProductMongoMapper()
      )
    );

    this.container
      .bind<ProductRepository>(ProductRepository.Token)
      .toConstantValue(productRepository);

    this.container
      .bind<ProducerRepository>(ProducerRepository.Token)
      .toConstantValue(producerRepository);

    /**
     * use cases
     */

    this.container
      .bind<AssignProducersUseCase>(AssignProducersUseCase.Token)
      .to(AssignProducersUseCase);

    this.container
      .bind<CreateProductsUseCase>(CreateProductsUseCase.Token)
      .to(CreateProductsUseCase);

    this.container
      .bind<UpdateProductUseCase>(UpdateProductUseCase.Token)
      .to(UpdateProductUseCase);

    this.container
      .bind<GetProductByIdUseCase>(GetProductByIdUseCase.Token)
      .to(GetProductByIdUseCase);

    this.container
      .bind<GetProductsByProducerIdUseCase>(
        GetProductsByProducerIdUseCase.Token
      )
      .to(GetProductsByProducerIdUseCase);

    this.container
      .bind<RemoveProductsUseCase>(RemoveProductsUseCase.Token)
      .to(RemoveProductsUseCase);

    /**
     * controllers
     */

    this.container
      .bind<ProductsController>(ProductsController.Token)
      .to(ProductsController);
  }
}
