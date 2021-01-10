import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/User";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    if (emailUser) {
      errors.email = "Email is already taken";
    }

    if (usernameUser) {
      errors.username = "Username is already taken";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User({ email, username, password });
    errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
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

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        error: `User with username \`${username}\` not found`,
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        password: "Password is incorrect",
      });
    }

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
router.post("/login", login);

export default router;
