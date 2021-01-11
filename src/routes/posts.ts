import { Request, Response, Router } from "express";
import Post from "../entities/Post";
import auth from "../middlewares/auth";
import User from "../entities/User";
import Sub from "../entities/Sub";

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;
  const user: User = res.locals.user;

  if (title.trim() === "") {
    return res.status(400).json({
      title: "Title must not be empty",
    });
  }

  try {
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const postsRoutes = Router();
postsRoutes.post("/", auth, createPost);

export default postsRoutes;
