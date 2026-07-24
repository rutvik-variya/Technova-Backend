import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

interface ValidateOptions {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

const validate =
    (schemas: ValidateOptions) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (schemas.body) {
                    req.body = await schemas.body.parseAsync(req.body);
                }
                next();
            } catch (error) {
                logger.error(error);
                next(error);
            }
        };

export default validate;