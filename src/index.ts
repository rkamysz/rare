/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";

import { Container } from "inversify";
import express from "express";
import * as Soap from "@soapjs/soap";

import { GraphQLServer, GraphQLRootBuilder } from "./core";
import { Dependencies } from "./dependencies";
import {
  schema,
  ProductQuery,
  SeedMutation,
  ProductsByProducerIdQuery,
  CreateProductsMutation,
  DeleteProductsMutation,
  UpdateProductMutation,
} from "./graphql";
import { Router } from "./router";

export const bootstrap = async () => {
  const config = new Soap.ConfigVars();
  const app = express();
  const port = config.getNumberEnv("PORT");
  const container = new Container();
  const dependencies = new Dependencies(container);
  const router = new Router(app);
  const root = new GraphQLRootBuilder();

  await dependencies.configure(config);

  app.use(express.json());

  root.withField(ProductQuery.create(container));
  root.withField(ProductsByProducerIdQuery.create(container));
  root.withField(CreateProductsMutation.create(container));
  root.withField(DeleteProductsMutation.create(container));
  root.withField(UpdateProductMutation.create(container));
  root.withField(SeedMutation.create(config.getStringEnv("CSV_PATH")));

  app.all("/graphql", GraphQLServer.create(root, schema));

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

bootstrap();
