import { Router } from "express";
import { AuthMiddleware } from "../../middleware/auth.middleware.js";
import { UploadMiddleware } from "../../middleware/upload.middleware.js";
import { ValidationMiddleware } from "../../middleware/validation.middleware.js";
import { CreateBlogDTO } from "./dto/create-blog.dto.js";
import { BlogController } from "./blog.controller.js";

export class BlogRouter {
  router: Router;

  constructor(
    private blogController: BlogController,
    private authMiddleware: AuthMiddleware,
    private uploadMiddleware: UploadMiddleware,
    private validationMiddleware: ValidationMiddleware,
  ) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes = () => {

    this.router.get("/", this.blogController.getBlogs);
    this.router.get("/:slug", this.blogController.getBlogBySlug);

    this.router.post(
      "/create-blog",
      this.authMiddleware.verifyToken(process.env.JWT_SECRET!),
      this.authMiddleware.verifyRole(["USER"]),
      this.uploadMiddleware
        .upload()
        .fields([{ name: "thumbnail", maxCount: 1 }]),
      this.validationMiddleware.validateBody(CreateBlogDTO),
      this.blogController.createBlog,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
