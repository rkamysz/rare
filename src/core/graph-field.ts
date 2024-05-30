import { Result } from "@soapjs/soap";
import { FieldIO } from "./field-io";

export class GraphField<T = unknown> {
  constructor(
    public readonly type: "query" | "mutation",
    public readonly name: string,
    public readonly resolver: (...args: unknown[]) => Promise<Result<T>>,
    public readonly io?: FieldIO
  ) {}

  build() {
    const { name, resolver, io } = this;
    return {
      name,
      resolver: async (obj) => {
        const input = io?.fromType ? io.fromType(obj) : obj;
        const result = await resolver(input);

        if (io?.toResponse) {
          return io.toResponse(result);
        }

        if (result.isFailure) {
          return result.failure.error;
        }

        return result.content;
      },
    };
  }
}
