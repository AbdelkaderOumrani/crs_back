import express, { Request, Response } from "express";
import { Specialite, ISpecialite } from "../models/specialite";
const router = express.Router();
// const data: ISpecialite[] =
router.post("/add-specialites", [], async (req: Request, res: Response) => {
  const specialites = req.body.specialites as ISpecialite[];
  console.log(`specialites`, req.body.specialites);
  specialites.map(async (specialite) => {
    await Specialite.build({ ...specialite });
  });
  const listeSpec = await Specialite.find();
  res.json(listeSpec);
});
router.get("/specialites", [], async (req: Request, res: Response) => {
  const listeSpec = await Specialite.find();
  res.json(listeSpec);
});
router.get("/sous-specialites", [], async (req: Request, res: Response) => {
  const spec = req.query.specialite as string;
  const listeSousSpec = await Specialite.find({ parent: spec });
  res.json(listeSousSpec);
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

export { router as SpecialiteRouter };
