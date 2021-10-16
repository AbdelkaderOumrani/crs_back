import express, { Request, Response } from "express";
import { dataSkills } from "../mockdata/data";
import { Skill } from "../models/skill";
import { Specialite, ISpecialite } from "../models/specialite";
const router = express.Router();
// const data: ISpecialite[] =

router.get("/skills", [], async (req: Request, res: Response) => {
  const skills = await Skill.find();
  res.json(skills);
});
export { router as DataRouter };
