# Rare - GraphQL API

## Overview
This project is a Node.js/TypeScript application built with Express, csv-parser, MongoDB, and my framework for clean architecture SoapJS. The application provides a GraphQL API for managing products, including operations to view, list, add, update, and remove products, as well as seeding the database from a CSV file.

## Prerequisites
To run this project, you need to have MongoDB set up either locally or using Docker. Additionally, you need to set environment variables in a `.env` file.

## Environment Variables
Create a `.env` file in the root directory of the project and add the following environment variables:
```
PORT=4000
DB_PORT=27017
DB_HOST=localhost
DB_NAME=rare
DB_REPLICA_SET=
CSV_PATH=https://api.frw.co.uk/feeds/all_listings.csv
WORKER_PATH=build/features/data/seed-from-csv.js
```

## Setting Up MongoDB

### Local Setup
To set up MongoDB locally, follow the instructions on the [official MongoDB website](https://docs.mongodb.com/manual/installation/).

### Docker Setup
Alternatively, you can use Docker to set up MongoDB. USe a `docker-compose.yml` file and run the following command to start the MongoDB service:

```bash
docker-compose up -d
```

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/rkamysz/rare.git
    cd rare
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Build the project:
    ```bash
    npm run build
    ```

4. Start the server:
    ```bash
    npm run start
    ```

## API Endpoints

The API has been switched from REST to GraphQL. All available operations can be tested using Postman, and the relevant queries and mutations are described below.

### GraphQL Operations

#### View Product
Fetch a product by its ID.
- **Method**: POST
- **URL**: `http://localhost:4000/graphql`
- **Request Body**:
    ```json
    {
      "query": "query { product(_id: \"6658b3793bcba5fb8a13857d\") { name vintage producerId producer { name country region } } }"
    }
    ```

#### List Products by Producer ID
List products by the producer's ID.
- **Method**: POST
- **URL**: `http://localhost:4000/graphql`
- **Request Body**:
    ```json
    {
      "query": "query { productsByProducerId(producerId: \"6658b3793bcba5fb8a13857c\") { _id name vintage producerId producer { _id name country region } } }"
    }
    ```

#### Add Products
Add multiple products.
- **Method**: POST
- **URL**: `http://localhost:4000/graphql`
- **Request Body**:
    ```json
    {
      "query": "mutation { createProducts(products: [{ vintage: \"2021\", name: \"Product 1\", producerId: \"6658b3793bcba5fb8a13857c\" }, { vintage: \"2020\", name: \"Product 2\", producerId: \"6658b3793bcba5fb8a13857c\" }]) { name vintage producerId } }"
    }
    ```

#### Update Product
Update an existing product by its ID.
- **Method**: POST
- **URL**: `http://localhost:4000/graphql`
- **Request Body**:
    ```json
    {
      "query": "mutation { updateProduct(_id: \"6658b3793bcba5fb8a13857d\", update: { name: \"New Name\", vintage: \"2019\", producerId: \"6658b3793bcba5fb8a13857c\" }) { _id name vintage producerId } }"
    }
    ```

#### Remove Product
Remove a product by its ID.
- **Method**: POST
- **URL**: `http://localhost:4000/graphql`
- **Request Body**:
    ```json
    {
      "query": "mutation { deleteProducts(ids: [\"6658b3793bcba5fb8a13857d\"]) }"
    }
    ```

#### Seed Database
Seed the database with products from a CSV file.
- **Method**: POST
- **URL**: `http://localhost:4000/graphql`
- **Request Body**:
    ```json
    {
      "query": "mutation { upsertProductsFromCSV(filePath: \"https://api.frw.co.uk/feeds/all_listings.csv\") }"
    }
    ```

## Project Structure

The project follows the principles of clean architecture, ensuring that the business logic is decoupled from the communication layer (Ive started with REST API but then wanted to try graphQL).

Features do not directly rely on GraphQL models, and mappers are provided to handle the data transformations. A worker is used for parsing CSV files and seeding the database.

## Notes
- This is a sample implementation meant for demonstration purposes and discussion.
- The project currently lacks comprehensive documentation and tests. These will be added after the weekend.
- There were no specific details provided, so for this example I used two collections: producers and products. Of course, we can use nested documents, it's all a matter of design and thinking about the best solutions to a given problem.
