import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entities/User";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let user;
    let validationErrors: any = {};
    try {
      const emailUser = await User.findOne({ email });
      const usernameUser = await User.findOne({ username });

      if (emailUser) {
        validationErrors.email = "Email is already taken";
      }

      if (usernameUser) {
        validationErrors.username = "Username is already taken";
      }

      if (Object.keys(validationErrors).length > 0) {
        throw validationErrors;
      }

      user = new User({ email, username, password });
      validationErrors = await validate(user);
      if (validationErrors.length > 0) throw validationErrors;
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
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
