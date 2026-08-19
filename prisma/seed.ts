import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { logger } from "../src/utils/logger";

const prisma = new PrismaClient();

async function main() {
    // await prisma.category.createMany({
    //     data: [
    //         { name: "Laptop & PC", slug: "laptop-pc" },
    //         { name: "Mobile & Tablet", slug: "mobile-tablet" },
    //         { name: "Accessories", slug: "accessories" },
    //     ],
    //     skipDuplicates: true,
    // })
    // console.log("category seeded successfully");


    // await prisma.user.create({
    //     data: {
    //         name: "admin",
    //         email: "admin@technova.com",
    //         password: await bcrypt.hash("123456789", 10),
    //         role: "ADMIN"
    //     }
    // })
    // logger.info("Admin seeded successfully");

    await prisma.shippingMethodConfig.upsert({
        where: {
            method: "STANDARD",
        },

        update: {},

        create: {
            method: "STANDARD",
            name: "Standard Delivery",
            baseCharge: 100,
            freeShippingAbove: 50000,
            esimatedDays: 5,
            isActive: true,
        },
    });

    await prisma.shippingMethodConfig.upsert({
        where: {
            method: "EXPRESS",
        },

        update: {},

        create: {
            method: "EXPRESS",
            name: "Express Delivery",
            baseCharge: 250,
            freeShippingAbove: 50000,
            esimatedDays: 2,
            isActive: true,
        },
    });
}

main()
    .catch((e) => {
        logger.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


