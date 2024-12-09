import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import userRoutes from "./routes/User.route.js";
import productRoutes from "./routes/Product.route.js";
import categoryRoutes from "./routes/Category.route.js";
import orderRoutes from "./routes/Order.route.js";
import onlineRoutes from "./routes/PickUpOrder.route.js";
import { connectDB } from "./lib/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Array of allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  // "https://myresturant-admin.onrender.com",
  // "https://imaginative-sorbet-54f06d.netlify.app",
  // "https://musical-taffy-590ced.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Allow credentials
  })
);

// Your other middleware/routes here

app.use(cookie());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/online", onlineRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("server is listening on port : ", PORT);
});
