import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
const router = express.Router();
import { Specialite } from '../models/specialite';
import { User } from '../models/user';
import { Course } from '../models/course';
import { CourseHistory } from '../models/courseHistory';
import { generateNumber } from '../helpers';
import { Student } from '../models/student';
import { Background } from '../models/background';
import { Formation } from '../models/formation';
import { FormationCourse } from '../models/formationCourse';

router.get('/recommendCourses', [], async (req: Request, res: Response) => {
  // const toRecommend: IToRecommend[] = [];
  const email = req.query.email as string;
  const formation = req.query.formation as string;
  const recommendOpt = req.query.recommendOpt as string;
  const formationSkills = await FormationCourse.aggregate()
    .match({ formation: mongoose.Types.ObjectId(formation) })
    .lookup({
      from: 'skills',
      localField: 'skill',
      foreignField: '_id',
      as: 'skill',
    })
    .unwind('skill')
    .then((res: any[]) => {
      return res.map((crs) => {
        return {
          skill: crs.skill._id,
          level: crs.aquiredLevel,
          prerequisite: crs.prerequisite,
        };
      });
    });
  console.log(`email`, email);
  const backgroundSkills = await Background.aggregate()
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
    .then((res: any[]) => {
      return res.map((bg) => {
        return {
          skill: bg.skill._id,
          level: bg.level,
        };
      });
    });

  const toRecommend: any[] = [];

  formationSkills.map((skill) => {
    const idx = backgroundSkills.findIndex(
      (bgs) => `${bgs.skill}` === `${skill.skill}`
    );
    if (idx < 0) {
      toRecommend.push({ ...skill, has: 0 });
    } else {
      const bgSkill = backgroundSkills[idx];
      if (bgSkill.level < skill.level) {
        toRecommend.push({ ...skill, has: bgSkill.level });
      }
    }
  });

  console.log('1');
  const result: any[] = [];
  await Promise.all(
    toRecommend.map(async (skl) => {
      console.log('2');
      for (let compt = skl.has + 1; compt < skl.level + 1; compt++) {
        console.log('3');
        await Course.aggregate()
          .lookup({
            from: 'skills',
            localField: 'skill',
            foreignField: '_id',
            as: 'skill',
          })
          .match({
            'skill._id': mongoose.Types.ObjectId(skl.skill),
            level: compt,
          })
          .sort(recommendOpt === 'rating' ? { rating: -1 } : { hours: 1 })
          .limit(1)
          .unwind('skill')
          .then((res) => {
            result.push({ course: res[0], prerequisite: skl.prerequisite });
          });
      }
    })
  );
  console.log('4');
  res.json(result);
});

router.get('/recommendFormations', [], async (req: Request, res: Response) => {
  const email = req.query.email as string;
  const backgrounds = await Background.aggregate()
    .lookup({
      from: 'students',
      localField: 'student',
      foreignField: '_id',
      as: 'student',
    })
    .match({ 'student.email': email })
    .then((data) =>
      data.map((bg) => {
        return {
          skill: bg.skill,
          level: bg.level,
        };
      })
    );
  const formations = await Formation.aggregate()
    .lookup({
      from: 'formationcourses',
      localField: 'courses',
      foreignField: '_id',
      as: 'courses',
    })
    .then((data: any[]) =>
      data.map((formation) => {
        let skills = formation.courses.map((crs: any) => {
          return {
            skill: crs.skill,
            level: crs.aquiredLevel,
          };
        });
        return { id: formation._id, skills };
      })
    );

  const calculate = formations.map((formation) => {
    const formationLevels = formation.skills
      .map((s: any) => s.level)
      .reduce((a: number, b: number) => a + b);
    const bgLevels = backgrounds
      .map((background) => {
        const idx = formation.skills.findIndex(
          (skill: any) => `${skill.skill}` === `${background.skill}`
        );
        console.log(`idx`, idx);
        if (idx >= 0) {
          let result = formation.skills[idx];

          return background.level > result.level
            ? result.level
            : background.level;
        }
        return 0;
      })
      .reduce((a: any, b: any) => a + b);

    if (bgLevels > 0) {
      return {
        formation: formation.id,
        percent: Math.floor((bgLevels / formationLevels) * 100),
      };
    }
    return;
  });

  const fIDs: string[] = calculate
    .filter((f) => f)
    .map((f) => (f ? f.formation : ''));
  console.log('fid', fIDs);
  // const agFormations = await Fo

  const formationsResult = await Formation.aggregate()
    .match({
      _id: {
        $in: fIDs,
      },
    })
    .lookup({
      from: 'formationcourses',
      localField: 'courses',
      foreignField: '_id',
      as: 'courses',
    })
    .lookup({
      from: 'skills',
      localField: 'courses.skill',
      foreignField: '_id',
      as: 'skills',
    });
  console.log(`formation`, formationsResult);
  // });

  res.json({
    formations: formationsResult,
    percents: calculate.filter((f) => f),
  });
});

export { router as RecommendationRouter };

// 1+++++++2>>>>2
// 2+++++++3>>>>3
// 1+++++++3>>>>2,3
