import express from "express";
import path, { dirname } from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import colors from "colors";
import morgan from "morgan";
const app = express();

//! Middleware for parsing json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//? importing routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

//? importing middleware
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

//! database connection
connectDB();

//! development library required for console logging about the routes
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//! routes initialization
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

//? for image uploading
app.use("/api/upload", uploadRoutes);
//? we cannot directly access to uploads folder so by following method we can access it
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//! for payment
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("api is running...");
  });
}

//! Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port  ${PORT}`.yellow
      .underline.bold
  )
);
