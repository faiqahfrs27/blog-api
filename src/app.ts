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
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors.js";
import "reflect-metadata";
import { ValidationMiddleware } from "./middleware/validation.middleware.js";
import { MailService } from "./modules/mail/mail.service.js";
import { CloudinaryService } from "./modules/cloudinary/cloudinary.service.js";
import { BlogService } from "./modules/blog/blog.service.js";
import { BlogController } from "./modules/blog/blog.controller.js";
import { BlogRouter } from "./modules/blog/blog.router.js";
import { UploadMiddleware } from "./middleware/upload.middleware.js";

export class App {
  app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.registerModules();
    this.errors();
  }

  private configure() {
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private registerModules() {
    // services
    const mailService = new MailService();
    const cloudinaryService = new CloudinaryService();
    const sampleService = new SampleService(prisma);
    const authService = new AuthService(prisma, mailService);
    const blogService = new BlogService(prisma, cloudinaryService);

    // controllers
    const sampleController = new SampleController(sampleService);
    const authController = new AuthController(authService);
    const blogController = new BlogController(blogService);

    //middlewares
    const authMiddleware = new AuthMiddleware();
    const validationMiddleware = new ValidationMiddleware();
    const uploadMiddleware = new UploadMiddleware();

    // routes
    const sampleRouter = new SampleRouter(sampleController, authMiddleware);
    const authRouter = new AuthRouter(authController, validationMiddleware, authMiddleware);
    const blogRouter = new BlogRouter(
      blogController,
      authMiddleware,
      uploadMiddleware,
      validationMiddleware,
    );

    // entry point
    this.app.use("/samples", sampleRouter.getRouter());
    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/blogs", blogRouter.getRouter());
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
