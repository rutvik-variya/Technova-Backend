import dotenv from "dotenv"
import { z } from "zod"

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum([
        "development",
        "production",
        "test",
    ]),

    PORT: z.coerce.number(),
    DATABASE_URL: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;
