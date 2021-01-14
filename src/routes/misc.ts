import { Request, Response, Router } from "express";
import User from "../entities/User";
import auth from "../middlewares/auth";
import Post from "../entities/Post";
import Vote from "../entities/Vote";
import Comment from "../entities/Comment";

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({
      value: "Value must be -1, 0 or 1",
    });
  }

  try {
    const user: User = res.locals.user;
    let post: Post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      comment = await Comment.findOneOrFail({
        identifier: commentIdentifier,
      });
      vote = await Vote.findOne({ user, comment });
    } else {
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value === 0) {
      return res.status(404).json({
        error: "Vote not found",
      });
    } else if (!vote) {
      vote = new Vote({ user, value });

      if (comment) {
        vote.comment = comment;
      } else {
        vote.post = post;
      }

      await vote.save();
    } else if (value === 0) {
      await vote.remove();
    } else if (vote.value !== value) {
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail(
      {
        identifier,
        slug,
      },
      {
        relations: ["comments", "sub", "votes"],
      },
    );

    return res.status(200).json(post);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const miscRoutes = Router();
miscRoutes.post("/vote", auth, vote);

export default miscRoutes;
