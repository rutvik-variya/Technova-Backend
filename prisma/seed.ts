import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.category.createMany({
        data: [
            { name: "Laptop & PC", slug: "laptop-pc" },
            { name: "Mobile & Tablet", slug: "mobile-tablet" },
            { name: "Accessories", slug: "accessories" },
        ],
        skipDuplicates: true,
    })
    console.log("category seeded successfully");
}


main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


