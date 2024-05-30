export class ProductNotFoundError extends Error {
  constructor(id?: string, producerId?: string) {
    const msg = id
      ? `Product with id ${id} not found.`
      : `Products from manufacturer ${producerId} not found`;
    super(msg);
  }
}

export class ProducerNotFoundError extends Error {
  constructor(id?: string) {
    super(`Producer with id ${id} not found.`);
  }
}
