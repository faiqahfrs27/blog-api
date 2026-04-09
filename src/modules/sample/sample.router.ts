import { Router } from "express";
import { SampleController } from "./sample.controller.js";
import { AuthMiddleware } from "../../middleware/auth.middleware.js";

export class SampleRouter {
  router: Router;

  constructor(
    private sampleController: SampleController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.get(
      "/",
      this.authMiddleware.verifyToken(process.env.JWT_SECRET!),
      this.sampleController.getSamples,
    );
    this.router.get(
      "/:id", //1
      this.authMiddleware.verifyToken(process.env.JWT_SECRET!), //2
      this.authMiddleware.verifyRole(["ADMIN"]), //3
      this.sampleController.getSample, //4
    );
  };

  getRouter = () => {
    return this.router;
  };
}
