import { Router } from "express";
import { AuthController } from "./auth.controller.js";

export class AuthRouter {
  router: Router;

  constructor(private authController: AuthController) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post("/register", this.authController.register);
  };

  getRouter = () => {
    return this.router;
  };
}
