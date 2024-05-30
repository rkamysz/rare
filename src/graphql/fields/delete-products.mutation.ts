import { Container } from "inversify";
import { FieldIO, GraphField } from "../../core";
import { ProductsController } from "../../features/domain/products.controller";

export class DeleteProductsMutationIO implements FieldIO {
  fromType(type: { ids: string[] }): string[] {
    return type.ids;
  }
}

export class DeleteProductsMutation extends GraphField<boolean> {
  static create(container: Container): GraphField<boolean> {
    const products = container.get<ProductsController>(
      ProductsController.Token
    );

    return new GraphField<boolean>(
      "mutation",
      "deleteProducts",
      products.delete.bind(products),
      new DeleteProductsMutationIO()
    );
  }
}
