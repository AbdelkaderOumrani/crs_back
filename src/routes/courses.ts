import express, { Request, Response } from "express";
import { Course } from "../models/course";
import { Specialite } from "../models/specialite";

const router = express.Router();

router.get("/all", [], async (req: Request, res: Response) => {
  const allCourses = await Course.find().limit(200);
  res.json(allCourses);
});
router.get("/specialites", [], async (req: Request, res: Response) => {
  const listeSpec = await Specialite.find();
  res.json(listeSpec);
});
// router.post("/addSpecialite", [], async (req: Request, res: Response) => {
//   const listespec: string[] = req.body.listespec.split(",");
//   console.log(`listspec`, listespec);
//   listespec.map(async (spec) => {
//     await Specialite.build({
//       name: spec.toLowerCase(),
//     }).save();
//   });
//   res.json(true);
// });

export { router as CoursesRouter };
