import cors from "cors";
import express, { Express } from "express";
import { prisma } from "./lib/prisma.js";
import { SampleController } from "./modules/sample/sample.controller.js";
import { SampleRouter } from "./modules/sample/sample.router.js";
import { SampleService } from "./modules/sample/sample.service.js";
import { globalError, notFoundError } from "./utils/errors.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { AuthController } from "./modules/auth/auth.controller.js";
import { AuthRouter } from "./modules/auth/auth.router.js";
import { AuthMiddleware } from "./middleware/auth.middleware.js";

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
    const authService = new AuthService(prisma);

    // controllers
    const sampleController = new SampleController(sampleService);
    const authController = new AuthController(authService);

    //middlewares
    const authMiddleware = new AuthMiddleware();

    // routes
    const sampleRouter = new SampleRouter(sampleController, authMiddleware);
    const authRouter = new AuthRouter(authController);

    // entry point
    this.app.use("/samples", sampleRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter());
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
