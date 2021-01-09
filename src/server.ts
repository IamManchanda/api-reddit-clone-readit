import express from "express";
import morgan from "morgan";
import "reflect-metadata";
import { createConnection } from "typeorm";
import authRoutes from "./routes/auth";

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", function welcomeToApi(_req, res) {
  return res.status(200).json({
    message: "Hello, Welcome to the API",
  });
});

app.use("/api/auth", authRoutes);

app.listen(5000, async function bootApp() {
  console.log("Server listening on http://localhost:5000");
  try {
    await createConnection();
    console.log("Database connection successfully established");
  } catch (error) {
    console.log(error);
  }
});
