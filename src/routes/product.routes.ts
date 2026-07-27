import { Router } from "express";

import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";
import { createProduct, deleteProduct, getProductBySlug, getProducts, updateProduct } from "../controller/product.controller";
import upload from "../middleware/upload.middleware";
import { deleteProductImage, getProductImage, setPrimaryProductImage, uploadProductImages } from "../controller/productImage.controller";
import { createVariantSchema } from "../validators/productVariant.validator";
import { createVariant } from "../controller/productVariant.controller";


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


// productImage Routes

router.post(
    "/:id/images",
    authenticate,
    authorize("ADMIN"),
    upload.array("images", 5),
    uploadProductImages
)

router.patch(
    "/:imageId/primary",
    authenticate,
    authorize("ADMIN"),
    setPrimaryProductImage
)

router.delete(
    "/:imageId/image",
    authenticate,
    authorize("ADMIN"),
    deleteProductImage
)

router.get(
    "/:id/images",
    getProductImage
);


// product variant

router.post(
    "/:productId/variants",
    authenticate,
    authorize("ADMIN"),
    validate({
        body: createVariantSchema
    }),
    createVariant
);

export default router;