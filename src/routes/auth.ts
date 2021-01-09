import { Request, Response, Router } from "express";
import { User } from "../entities/User";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let user;
    try {
      user = new User({ email, username, password });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const router = Router();
router.post("/register", register);
export default router;
