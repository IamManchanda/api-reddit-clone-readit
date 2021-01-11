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

const readPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find({
      order: {
        createdAt: "DESC",
      },
    });
    return res.status(200).json(posts);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const findPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  try {
    const post = await Post.findOneOrFail(
      { identifier, slug },
      {
        relations: ["sub"],
      },
    );
    return res.status(200).json(post);
  } catch (error) {
    console.log({ error });
    return res.status(404).json({
      error: `Post with identifier \`${identifier}\` and slug \`${slug}\` not found`,
    });
  }
};

const postsRoutes = Router();
postsRoutes.post("/", auth, createPost);
postsRoutes.get("/", readPosts);
postsRoutes.get("/:identifier/:slug", findPost);

export default postsRoutes;
