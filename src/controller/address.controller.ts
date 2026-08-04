import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ADDRESS_MESSAGE } from "../types/address.types";
import { createAddressService, deleteAddressService, getMyAddressesService, getSingleAddressService, setDefaultAddressService, updateAddressService } from "../service/address.service";


type AuthenticatedRequest = Request & {
    user: {
        id: string;
    };
};

export const createAddress = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const address = await createAddressService(
            req.user.id,
            req.body
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                ADDRESS_MESSAGE.CREATED,
                address
            )
        );
    }
);

export const getMyAddresses = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const addresses = await getMyAddressesService(
            req.user.id
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                ADDRESS_MESSAGE.FETCHED_ALL,
                addresses
            )
        );
    }
);


export const getSingleAddress = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user.id
        const { addressId } = req.params;

        const address = await getSingleAddressService(
            userId,
            addressId as string
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                ADDRESS_MESSAGE.FETCHED,
                address
            )
        );
    }
);


export const updateAddress = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const address = await updateAddressService(
            req.user.id,
            req.params.addressId as string,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                ADDRESS_MESSAGE.UPDATED,
                address
            )
        );
    }
);

export const deleteAddress = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        await deleteAddressService(
            req.user.id,
            req.params.addressId as string
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                ADDRESS_MESSAGE.DELETED,
            )
        )
    }
);

export const setDefaultAddress = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const address = await setDefaultAddressService(
            req.user.id,
            req.params.addressId as string
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                ADDRESS_MESSAGE.DEFAULT_UPDATED,
                address
            )
        )
    }
);