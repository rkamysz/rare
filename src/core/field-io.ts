import { Result } from "@soapjs/soap";

export interface FieldIO<T = unknown, I = unknown, O = unknown, R = unknown> {
  fromType?(type: T): I;
  toResponse?(result: Result<O>): R;
}
