import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { ApiError } from "../utils/ApiError";

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
                if (error instanceof ZodError) {
                    return next(
                        new ApiError(
                            400,
                            "Validation failed",
                            error.issues
                        )
                    );
                }

                next(error);
            }
        };

export default validate;