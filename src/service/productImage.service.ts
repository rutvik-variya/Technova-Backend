import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { PRODUCT_MESSAGE } from "../types/product.types";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import cloudinary from "../lib/cloudinary";

export const uploadProductImagesService = async (
    productId: string,
    files: Express.Multer.File[]
) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });

    if (!product) {
        throw new ApiError(404, PRODUCT_MESSAGE.NOT_FOUND);
    }

    const uploadedImages = [];
    for (const file of files) {

        const result: any = await uploadToCloudinary(
            file.buffer,
            "technova/products"
        );

        const imageCount = await prisma.productImage.count({
            where: {
                productId,
            },
        });

        const image = await prisma.productImage.create({
            data: {
                productId,
                url: result.secure_url,
                publicId: result.public_id,
                isPrimary: imageCount === 0,
            },
        });

        uploadedImages.push(image);
    }
}

export const getProductImagesService = async (
    productId: string
) => {

    const productImg = await prisma.productImage.findMany({
        where: {
            productId,
        },

        orderBy: {
            displayOrder: "asc",
        },
    });

    return productImg
};


export const setPrimaryProductImageService = async (
    imageId: string
) => {
    const image = await prisma.productImage.findUnique({
        where: {
            id: imageId,
        },
    });

    if (!image) {
        throw new ApiError(404, PRODUCT_MESSAGE.IMAGE_NOT_FOUND);
    }

    const [, updatedImage] = await prisma.$transaction([

        prisma.productImage.updateMany({
            where: {
                productId: image.productId,
            },
            data: {
                isPrimary: false,
            },
        }),

        prisma.productImage.update({
            where: {
                id: imageId,
            },
            data: {
                isPrimary: true,
            },
        }),

    ]);

    return updatedImage;
};


export const deleteProductImageService = async (
    imageId: string
) => {

    const image = await prisma.productImage.findUnique({
        where: {
            id: imageId,
        },
    });

    if (!image) {
        throw new ApiError(404, PRODUCT_MESSAGE.IMAGE_NOT_FOUND);
    }

    if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
    }

    await prisma.productImage.delete({
        where: {
            id: imageId,
        },
    });

    if (image.isPrimary) {

        const nextImage = await prisma.productImage.findFirst({
            where: {
                productId: image.productId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        if (nextImage) {
            await prisma.productImage.update({
                where: {
                    id: nextImage.id,
                },
                data: {
                    isPrimary: true,
                },
            });
        }
    }
};
