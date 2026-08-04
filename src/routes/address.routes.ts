import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { addressIdSchema, createAddressSchema, setDefaultAddressSchema, updateAddressSchema } from "../validators/address.validator";
import { createAddress, deleteAddress, getMyAddresses, getSingleAddress, setDefaultAddress, updateAddress } from "../controller/address.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    validate({
        body: createAddressSchema
    }),
    createAddress
);

router.get(
    "/",
    authenticate,
    getMyAddresses
)

router.get(
    "/:addressId",
    authenticate,
    validate({
        params: addressIdSchema,
    }),
    getSingleAddress
);


router.patch(
    "/:addressId",
    authenticate,
    validate({
        body: updateAddressSchema,
    }),
    updateAddress
);

router.delete(
    "/:addressId",
    authenticate,
    deleteAddress
);


router.patch(
    "/:addressId/default",
    authenticate,
    validate({
        params: setDefaultAddressSchema,
    }),
    setDefaultAddress
);

export default router;