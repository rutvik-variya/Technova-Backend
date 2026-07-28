import { Router } from "express";

import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";
import { createProduct, deleteProduct, getProductBySlug, getProducts, updateProduct } from "../controller/product.controller";
import upload from "../middleware/upload.middleware";
import { deleteProductImage, getProductImage, setPrimaryProductImage, uploadProductImages } from "../controller/productImage.controller";
import { createVariantSchema, updateVariantSchema } from "../validators/productVariant.validator";
import { createVariant, deleteVariant, getProductVariants, getVariantById, updateVariant } from "../controller/productVariant.controller";
import { adjustInventory, getInventory, getLowStockProducts, getOutOfStockProducts, updateInventory } from "../controller/productInventory.controller";
import { adjustInventorySchema, updateInventorySchema } from "../validators/productInvetory.validator";


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


router.get(
    "/:productId/variants",
    getProductVariants
);

router.get(
    "/variants/:variantId",
    getVariantById
)

router.patch(
    "/variants/:variantId",
    authenticate,
    authorize("ADMIN"),
    validate({
        body: updateVariantSchema,
    }),
    updateVariant
)

router.delete(
    "/variants/:variantId",
    authenticate,
    authorize("ADMIN"),
    deleteVariant
);

// Inventory Route
router.get(
    "/variants/:variantId/inventory",
    getInventory
);


router.patch(
    "/variants/:variantId/inventory",
    authenticate,
    authorize("ADMIN"),
    validate({
        body: updateInventorySchema
    }),
    updateInventory
)

router.post(
    "/variants/:variantId/inventory/adjust",
    authenticate,
    authorize("ADMIN"),
    validate({
        body: adjustInventorySchema,
    }),
    adjustInventory
)

router.get(
    "/inventory/low-stock",
    authenticate,
    authorize("ADMIN"),
    getLowStockProducts
)

router.get(
    "/inventory/out-of-stock",
    authenticate,
    authorize("ADMIN"),
    getOutOfStockProducts
);

export default router;