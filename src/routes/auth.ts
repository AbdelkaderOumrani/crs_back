import express, { Request, Response } from "express";
import { User } from "../models/user";
import { Course, ICourseDocument } from "../models/course";
import { Specialite } from "../models/specialite";
import { CourseHistory } from "../models/courseHistory";
import { generateNumber } from "../helpers";

const router = express.Router();

router.get("/prevCourses", [], async (req: Request, res: Response) => {
  const email = req.query.email as string;
  const user = await User.findOne({ email }).populate("prevCourses");
  if (user) {
    console.log(`user.prevCourses`, user.prevCourses);
    res.json(user.prevCourses);
  } else {
    res.sendStatus(403);
  }
});
router.post("/updateProfile", [], async (req: Request, res: Response) => {
  const selectedCourses: any[] = req.body.selectedCourses;
  const email = req.body.email;
  await User.updateOne({ email }, { $set: { prevCourses: [] } });
  selectedCourses.map(async (course) => {
    let crs = await Course.findOne({ code: course.code });
    await User.updateOne({ email }, { $push: { prevCourses: crs?._id } });
  });
  const user = await User.findOne({ email });
  res.json(user);
});
router.get("/all", [], async (req: Request, res: Response) => {
  const listeUser = await User.find().sort({ specialite: 1 });

  res.json(listeUser);
});
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
  const { fullName, email, password, specialite } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    console.log(`exists`, exists);
    res.json(false);
  } else {
    const newUser = await User.build({
      email,
      password,
      fullName,
      finished: false,
      specialite: specialite,
      prevCourses: [],
    }).save();
    console.log(`newUser`, newUser);
    res.json(newUser);
  }
});

export { router as AuthRouter };
