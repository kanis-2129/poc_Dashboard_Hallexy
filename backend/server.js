import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes.js";


dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/orders", orderRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected");
    console.log("DB NAME:", mongoose.connection.name);
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, "127.0.0.1", () =>
  console.log(`Server running on port ${PORT}`)
);

