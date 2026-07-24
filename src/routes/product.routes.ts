import { Router } from "express";

import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";
import { createProduct, deleteProduct, getProductBySlug, getProducts, updateProduct } from "../controller/product.controller";

const router = Router();

router.post("/",
    authenticate,
    authorize("ADMIN"),
    validate({ body: createProductSchema }),
    createProduct
);

router.get("/", getProducts)

router.get("/:slug", getProductBySlug)

router.patch(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate({ body: updateProductSchema }),
    updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteProduct
);


export default router;