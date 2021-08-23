import { Types } from "mongoose";
import express, { Request, Response } from "express";
import { Course, ICourseDocument } from "../models/course";
import { CourseHistory } from "../models/courseHistory";
import { Specialite } from "../models/specialite";
import { User } from "../models/user";
import { count_similarities, detectTerm, generateNumber } from "../helpers";

function getRandom(arr: any, n: number) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const router = express.Router();

router.get("/all", [], async (req: Request, res: Response) => {
  let specialite: string = req.query.specialite as string;
  if (specialite) {
    const courses = await Course.find({
      specialite: specialite,
    }).sort({ term: 1 });
    res.json(courses);
  } else {
    const allCourses = await Course.find().sort({ term: 1 });
    res.json(allCourses);
  }
});
router.get("/allHistory", [], async (req: Request, res: Response) => {
  const result = await CourseHistory.find().limit(100).populate("course");
  res.json(result);
});

export { router as CoursesRouter };
