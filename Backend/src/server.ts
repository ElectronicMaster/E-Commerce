import express from "express";
import dotenv from "dotenv";
import pool from "./config/db";
import userRoutes from "./routes/userRoutes"
import sellerRoutes from "./routes/salesmanRoutes"
import deliverRoutes from "./routes/DeliverRoutes"

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes)
app.use("/seller", sellerRoutes)
app.use("/deliver", deliverRoutes)

const PORT = process.env.PORT || 5000;
app.listen( PORT, () => console.log(`Server running on port: ${PORT}`))