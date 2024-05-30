import * as Soap from "@soapjs/soap";
import { Product } from "../entities/product";
import { inject, injectable } from "inversify";
import { ProductRepository } from "../repositories/product.repository";
import { ProducerRepository } from "../repositories/producer.repository";
import { ProductNotFoundError } from "../errors";

@injectable()
export class GetProductByIdUseCase implements Soap.UseCase<Product> {
  static Token = "GetProductByIdUseCase";

  constructor(
    @inject(ProductRepository.Token)
    private productRepository: ProductRepository,
    @inject(ProducerRepository.Token)
    private producerRepository: ProducerRepository
  ) {}

  async execute(id: string): Promise<Soap.Result<Product>> {
    const { content: products, failure: getProductFailure } =
      await this.productRepository.find({
        where: new Soap.Where().valueOf("id").isEq(id),
      });

    if (getProductFailure) {
      return Soap.Result.withFailure(getProductFailure);
    }

    if (products.length === 0) {
      return Soap.Result.withFailure(new ProductNotFoundError(id));
    }

    const product = products[0];
    const { content: producers, failure: getProducerFailure } =
      await this.producerRepository.find({
        where: new Soap.Where().valueOf("id").isEq(product.producerId),
      });

    if (getProducerFailure) {
      return Soap.Result.withFailure(getProductFailure);
    }

    if (producers.length > 0) {
      product.addProducerDetails(producers[0]);
    }

    return Soap.Result.withContent(product);
  }
}
