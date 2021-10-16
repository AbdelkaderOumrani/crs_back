import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { FormationCourse } from '../models/formationCourse';
import { Background } from '../models/background';
import { Formation } from '../models/formation';

const router = express.Router();

router.get('/calculateProgress', [], async (req: Request, res: Response) => {
  const fid = req.query.fid as string;
  const email = req.query.email as string;

  type RESULT = { _id: string; name: string; level: number };

  const formationSkills = await FormationCourse.aggregate()
    .match({
      formation: mongoose.Types.ObjectId(fid),
    })
    .lookup({
      from: 'skills',
      localField: 'skill',
      foreignField: '_id',
      as: 'skill',
    })
    .unwind('skill')
    .project('-skill.courses')
    .group({
      _id: '$skill._id',
      name: { $first: '$skill.name' },
      level: { $first: '$aquiredLevel' },
    })
    .then((result: RESULT[]) => {
      return Background.aggregate()
        .lookup({
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'student',
        })
        .match({
          'student.email': email,
        })
        .lookup({
          from: 'skills',
          localField: 'skill',
          foreignField: '_id',
          as: 'skill',
        })
        .unwind('skill')
        .unwind('student')
        .then((backgrounds) => {
          type BG = { skill: string; level: number };

          const bgs: BG[] = backgrounds.map((bg) => {
            return { skill: bg.skill._id, level: bg.level };
          });
          const total = result.map((r) => r.level).reduce((a, b) => a + b);

          const calculate = bgs
            .map((bg) => {
              const idx = result.findIndex((x) => `${x._id}` === `${bg.skill}`);
              if (idx < 0) {
                return 0;
              } else {
                const rSkill = result[idx];
                return bg.level >= rSkill.level ? rSkill.level : bg.level;
              }
            })
            .reduce((a, b) => a + b);
          console.log(calculate);
          console.log(total);

          return Formation.aggregate()
            .match({
              _id: mongoose.Types.ObjectId(fid),
            })
            .then((formation) => {
              return {
                formation: formation[0],
                progress: Math.floor((100 * calculate) / total),
                skills: result,
              };
            });
        });
    });

  if (formationSkills) {
    res.json(formationSkills);
  } else {
    res.json(false);
  }
});

export { router as FormationsRouter };
