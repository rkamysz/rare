import * as Soap from "@soapjs/soap";
import { Product } from "../entities/product";
import { inject, injectable } from "inversify";
import { ProductRepository } from "../repositories/product.repository";
import { ProducerRepository } from "../repositories/producer.repository";
import { ProducerNotFoundError, ProductNotFoundError } from "../errors";

@injectable()
export class GetProductsByProducerIdUseCase implements Soap.UseCase<Product[]> {
  static Token = "GetProductsByProducerIdUseCase";

  constructor(
    @inject(ProductRepository.Token)
    private productRepository: ProductRepository,
    @inject(ProducerRepository.Token)
    private producerRepository: ProducerRepository
  ) {}

  async execute(producerId: string): Promise<Soap.Result<Product[]>> {
    const { content: producers, failure: getProducerFailure } =
      await this.producerRepository.find({
        where: new Soap.Where().valueOf("id").isEq(producerId),
      });

    if (getProducerFailure) {
      return Soap.Result.withFailure(getProducerFailure);
    }

    if (producers.length === 0) {
      return Soap.Result.withFailure(new ProducerNotFoundError(producerId));
    }
    const producer = producers[0];

    const { content: products, failure: getProductsFailure } =
      await this.productRepository.find({
        where: new Soap.Where()
          .valueOf(new Soap.IdType("producerId"))
          .isEq(producerId),
      });

    if (getProductsFailure) {
      return Soap.Result.withFailure(getProductsFailure);
    }

    if (products.length === 0) {
      return Soap.Result.withFailure(
        new ProductNotFoundError(null, producer.name)
      );
    }

    products.forEach((product) => {
      product.addProducerDetails(producer);
    });

    return Soap.Result.withContent(products);
  }
}
