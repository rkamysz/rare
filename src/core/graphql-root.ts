/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphField } from "./graph-field";

export class GraphQLRootBuilder {
  private list: GraphField[] = [];

  private isField(value: any): value is GraphField {
    return (
      value &&
      (value.type === "query" || value.type === "mutation") &&
      typeof value.build === "function"
    );
  }

  withField<T = unknown>(field: GraphField<T>): this {
    if (this.isField(field)) {
      this.list.push(field);
    } else {
      // log error
    }
    return this;
  }

  build() {
    const root = {};

    this.list.forEach((field) => {
      const { name, resolver } = field.build();
      root[name] = resolver;
    });

    return root;
  }
}
