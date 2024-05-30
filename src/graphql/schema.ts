import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Producer {
    _id: ID!
    name: String!
    country: String
    region: String
  }

  type Product {
    _id: ID!
    vintage: String!
    name: String!
    producerId: ID!
    producer: Producer
  }

  input ProductInput {
    vintage: String!
    name: String!
    producerId: ID!
  }

  type Query {
    product(_id: ID!): Product
    productsByProducerId(producerId: ID!): [Product]
  }

  type Mutation {
    createProducts(products: [ProductInput]!): [Product]
    updateProduct(_id: ID!, update: ProductInput): Product
    deleteProducts(ids: [ID!]!): Boolean
    upsertProductsFromCSV(filePath: String!): Boolean
  }
`);
