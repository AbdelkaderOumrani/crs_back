import express, { Request, Response } from "express";
import { User } from "../models/user";
import { Course } from "../models/course";

const router = express.Router();

router.post("/login", [], async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const exists = await User.findOne({ email, password });
  if (exists) {
    res.json(exists);
  } else {
    res.json(false);
  }
});
router.post("/register", [], async (req: Request, res: Response) => {
  console.log(`req.body`, req.body);
  const { fullName, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    console.log(`exists`, exists);
    res.json(false);
  } else {
    const newUser = await User.build({
      email,
      password,
      fullName,
      isNewUser: true,
      finished: false,
      specialite: "",
    }).save();
    console.log(`newUser`, newUser);
    res.json(newUser);
  }
});

export { router as AuthRouter };
