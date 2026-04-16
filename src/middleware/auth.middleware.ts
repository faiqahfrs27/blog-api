import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/enums.js";

export class AuthMiddleware {
  verifyToken = (secretKey: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let token : string | undefined;

        //kl authbearertoken ada, masukin authbearertokennya ke variabel token
        const authBearerToken = req.headers.authorization?.split("")[1];
        if (authBearerToken) {
            token = authBearerToken;
        }

        //kalo variabel token ga keisi, brrti cb isi variabelnya dengan token yg ada di cookie
        if (!token) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            throw new ApiError("no token provided,", 400)
        }

        try {
            const payload = jwt.verify(token, secretKey);
            res.locals.user = payload;
            next();
        } catch (error) {

        }
        // const token = req.cookies?.accessToken;
        // const token = req.headers.authorization?.split("")[1]; //"Bearer jaogducdhguailhducila"

        if (!token) throw new ApiError("No token provided", 401);

        try {
            const payload = jwt.verify(token, secretKey);
            res.locals.user = payload;
            next();
        } catch (error) {
            if(error instanceof jwt.TokenExpiredError){
                return next(new ApiError("Token Expired", 401));
            }

            return next(new ApiError("Token Invalid", 401))
        }
    };
  };

  verifyRole= (roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = res.locals.user.role;

        if(!userRole || !roles.includes(userRole)){
            throw new ApiError("You don't have access", 403);
        }

        next();
    }
  };
}
