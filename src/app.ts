import cors from "cors";
import express, { Express } from "express";
import { prisma } from "./lib/prisma.js";
import { SampleController } from "./modules/sample/sample.controller.js";
import { SampleRouter } from "./modules/sample/sample.router.js";
import { SampleService } from "./modules/sample/sample.service.js";
import { globalError, notFoundError } from "./utils/errors.js";

export class App {
  app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.registerModules();
    this.errors();
  }

  private configure() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private registerModules() {
    // services
    const sampleService = new SampleService(prisma);

    // controllers
    const sampleController = new SampleController(sampleService);

    // routes
    const sampleRouter = new SampleRouter(sampleController);

    // entry point
    this.app.use("/samples", sampleRouter.getRouter());
  }

  private errors() {
    this.app.use(globalError);
    this.app.use(notFoundError);
  }

  start() {
    const PORT = process.env.PORT;
    this.app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  }
}
