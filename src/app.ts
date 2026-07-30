import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes'
import categryRoutes from './routes/category.routes'
import productRoutes from "./routes/product.routes"
import reviewsRoutes from "./routes/review.routes"
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true, }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_, res) => {
    res.send({ message: "TechNova API Running" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewsRoutes);

app.use(errorHandler)
export default app;
