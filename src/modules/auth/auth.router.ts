import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { RegisterDTO } from "./dto/register.dto.js";
import { ValidationMiddleware } from "../../middleware/validation.middleware.js";
import { LoginDTO } from "./dto/login.dto.js";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto.js";
import { ResetPasswordDTO } from "./dto/reset-password.dto.js";
import { AuthMiddleware } from "../../middleware/auth.middleware.js";

export class AuthRouter {
  router: Router;

  constructor(
    private authController: AuthController,
    private validationMiddleware: ValidationMiddleware,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post(
      "/register",
      this.validationMiddleware.validateBody(RegisterDTO),
      this.authController.register,
    );
    this.router.post(
      "/login",
      this.validationMiddleware.validateBody(LoginDTO),
      this.authController.login,
    );
    this.router.post("/logout", this.authController.logout);
    this.router.post("/refresh", this.authController.refresh);
    this.router.post(
      "/forgot-password",
      this.validationMiddleware.validateBody(ForgotPasswordDTO),
      this.authController.forgotPassword,
    );
    this.router.post(
      "/reset-password",
      this.authMiddleware.verifyToken(process.env.JWT_SECRET_RESET!),
      this.validationMiddleware.validateBody(ResetPasswordDTO),
      this.authController.resetPassword,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
