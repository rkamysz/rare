import path from "path";
import { Worker } from "worker_threads";
import { ConfigVars, Result } from "@soapjs/soap";
import { FieldIO, GraphField } from "../../core";

export class SeedMutationIO implements FieldIO {
  fromType(type: { filePath: string }): string {
    return type.filePath;
  }
}

export class SeedMutation extends GraphField<boolean> {
  static create(defaultFilePath: string, batchSize = 100): GraphField<boolean> {
    const config = new ConfigVars();

    return new GraphField<boolean>(
      "mutation",
      "upsertProductsFromCSV",
      async (filePath: string) => {
        const worker = new Worker(
          path.resolve(process.cwd(), config.getStringEnv("WORKER_PATH")),
          {
            workerData: { filePath: filePath || defaultFilePath, batchSize },
          }
        );

        worker.on("message", (message) => {
          if (message.success) {
            console.log("CSV processing completed successfully");
          } else {
            console.error("Worker error:", message.error);
          }
        });

        worker.on("error", (error) => {
          console.error("Worker failed:", error);
        });

        worker.on("exit", (code) => {
          if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
          }
        });

        return Result.withContent(true);
      },
      new SeedMutationIO()
    );
  }
}
