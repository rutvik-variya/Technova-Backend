import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes';
import categryRoutes from './routes/category.routes';
import productRoutes from "./routes/product.routes";
import reviewsRoutes from "./routes/review.routes";
import recentViewRoutes from "./routes/recentlyViewed.route";
import cartRoutes from "./routes/cart.routes";
import addressRoutes from "./routes/address.routes";
import wishlistRoutes from "./routes/wishlist.routes"
import orderRoutes from "./routes/order.routes"
import checkoutRoutes from "./routes/checkout.routes"
import paymentRoutes from "./routes/payment.routes"
import couponRoutes from "./routes/coupon.routes"
import shippingRoutes from "./routes/shipping.routes"

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
app.use("/api/v1/recently-view", recentViewRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/shipping", shippingRoutes);


app.use(errorHandler)

export default app;


