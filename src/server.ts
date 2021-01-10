import express from "express";
import morgan from "morgan";
import "reflect-metadata";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import trim from "./middlewares/trim";

dotenv.config();

const app = express();
const { PORT } = process.env;

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, async function bootApp() {
  console.log(`Server listening on http://localhost:${PORT}`);
  try {
    await createConnection();
    console.log("Database connection successfully established");
  } catch (error) {
    console.log(error);
  }
});
