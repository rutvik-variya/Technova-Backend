import { Router } from "express";

import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { categoryParamsSchema, createCategorySchema, updateCategorySchema } from "../validators/category.validator";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controller/category.controller";

const router = Router();
router.post("/",
    authenticate,
    authorize("ADMIN"),
    validate({ body: createCategorySchema }),
    createCategory
)

router.get(
    "/",
    getCategories
);

router.get(
    "/:id",
    validate({
        params: categoryParamsSchema,
    }),
    getCategoryById
);

router.patch(
    "/:id",
    validate({
        params: categoryParamsSchema,
        body: updateCategorySchema
    }),
    authenticate,
    authorize("ADMIN"),
    updateCategory
);

router.delete("/:id",
    authenticate,
    authorize("ADMIN"),
    validate({
        params: categoryParamsSchema
    }),
    deleteCategory
)


export default router;
