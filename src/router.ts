import * as Soap from "@soapjs/soap";
import { Request, Response, Express, NextFunction } from "express";

export class Router {
  constructor(private app: Express) {}

  mount(route: Soap.Route) {
    const methodLC = route.method.toLowerCase();

    if (this.app[methodLC]) {
      this.app[methodLC](
        route.path,
        route.options?.middlewares || [],
        async (req: Request, res: Response, next: NextFunction) => {
          const input = route.options?.io.fromRequest
            ? route.options.io.fromRequest(req)
            : req;

          const result = await route.handler(input);

          if (route.options?.io.toResponse) {
            route.options.io.toResponse;
          } else {
            res.status(200).send(result);
          }

          // cause timeout
        }
      );
    }
  }
}
