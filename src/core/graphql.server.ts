/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { graphql } from "graphql";
import { GraphQLRootBuilder } from "./graphql-root";

export class GraphQLServer {
  static create(root: GraphQLRootBuilder, schema: any) {
    return async (req: Request, res: Response) => {
      const { query: source, variables: variableValues } = req.body;

      const response = await graphql({
        schema,
        source,
        rootValue: root.build(),
        variableValues,
      });

      if (response.errors?.length === 1) {
        const [error] = response.errors;
        const httpErrorMatch = error.message.match(/^\[([0-9]+)\].+$/);
        const status = httpErrorMatch ? +httpErrorMatch[1] : 500;
        res.status(status).send(error.message);
      } else if (response.errors?.length > 1) {
        res.status(500).json(response.errors);
      } else {
        res.status(200).json(response.data);
      }
    };
  }
}
