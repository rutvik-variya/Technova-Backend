import { Router } from "express";

import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { createProductSchema, updateFeaturedSchema, updateProductSchema } from "../validators/product.validator";
import { createProduct, deleteProduct, getFeaturedProducts, getProductBySlug, getProducts, getRelatedProducts, updateFeaturedStatus, updateProduct } from "../controller/product.controller";
import upload from "../middleware/upload.middleware";
import { deleteProductImage, getProductImage, setPrimaryProductImage, uploadProductImages } from "../controller/productImage.controller";
import { createVariantSchema, updateVariantSchema } from "../validators/productVariant.validator";
import { createVariant, deleteVariant, getProductVariants, getVariantById, updateVariant } from "../controller/productVariant.controller";
import { adjustInventory, getInventory, getLowStockProducts, getOutOfStockProducts, updateInventory } from "../controller/productInventory.controller";
import { adjustInventorySchema, updateInventorySchema } from "../validators/productInvetory.validator";


const router = Router();

// static Route of product module 

router.get("/", getProducts)

router.get(
    "/:id/images",
    getProductImage
);


router.get(
    "/:productId/variants",
    getProductVariants
);

router.get(
    "/variants/:variantId",
    getVariantById
)

router.get(
    "/variants/:variantId/inventory",
    getInventory
);

router.get(
    "/featured",
    getFeaturedProducts
)

router.get(
    "/:slug/related",
    getRelatedProducts
);

// product routes

router.post("/",
    authenticate,
    authorize("ADMIN"),
    validate({ body: createProductSchema }),
    createProduct
);

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

router.get("/:slug", getProductBySlug)

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


// feature product routes 

router.patch(
    "/:id/featured",
    authenticate,
    authorize("ADMIN"),
    validate({
        body: updateFeaturedSchema,
    }),
    updateFeaturedStatus
)
export default router;