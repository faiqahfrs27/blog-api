import { PrismaClient } from "../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
import { generateSlug } from "../../utils/generate-slug.js";
import { CreateBlogDTO } from "../auth/dto/create-blog.dto.js";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";

export class BlogService {
  constructor(
    private prisma: PrismaClient,
    private cloudinaryService: CloudinaryService,
  ) {}


  createBlog = async (
    body: CreateBlogDTO,
    thunbnail: Express.Multer.File,
    userId: number,
  ) => {
    const blog = await this.prisma.blog.findUnique({
        where: {
            title: body.title
        },
    });

    if (blog) throw new ApiError("title already in use", 400);

    const slug = generateSlug(body.title);

    const {secure_url} = await this.cloudinaryService.upload(thunbnail);

    await this.prisma.blog.create({
        data: {
            ...body,
            slug: slug,
            thumbnail: secure_url,
            userId: userId,
        },
    });

    return {message: "create blog success"}
  };
}
