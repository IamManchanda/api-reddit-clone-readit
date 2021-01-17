import express from "express";
import morgan from "morgan";
import "reflect-metadata";
import { createConnection } from "typeorm";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import subsRoutes from "./routes/subs";
import miscRoutes from "./routes/misc";
import trim from "./middlewares/trim";

dotenv.config();

const app = express();
const { PORT, ORIGIN } = process.env;

app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ORIGIN,
    optionsSuccessStatus: 200,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/subs", subsRoutes);
app.use("/api/misc", miscRoutes);

app.listen(PORT, async function bootApp() {
  console.log(`Server listening on http://localhost:${PORT}`);
  try {
    await createConnection();
    console.log("Database connection successfully established");
  } catch (error) {
    console.log({ error });
  }
});
