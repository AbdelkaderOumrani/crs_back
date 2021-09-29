import { IFormationCourseDocument } from './../models/formationCourse';
import { DB_USERNAME } from './../dbConfig';
import express, { Request, Response } from 'express';
const router = express.Router();
import { Specialite } from '../models/specialite';
import { User } from '../models/user';
import { Course } from '../models/course';
import { CourseHistory } from '../models/courseHistory';
import { generateArray, generateNumber } from '../helpers';
import { Skill } from '../models/skill';
import { dataSkills, formationsData } from '../mockdata/data';
import { Formation } from '../models/formation';
import { FormationCourse } from '../models/formationCourse';

router.get('/generateSkills', [], async (req: Request, res: Response) => {
  // const skills: string[] = req.body.skills;
  console.log(`generator`);
  dataSkills.map(async (sk) => {
    await Skill.build({ name: sk, courses: [] }).save();
  });
  const result = await Skill.find();
  res.json(result);
});

router.get('/generateCourses', [], async (req: Request, res: Response) => {
  console.log('here1');
  const skills = await Skill.find();
  if (skills) {
    console.log('inside');

    const levelsArray: { code: string; label: string }[] = [
      { code: 'BG', label: 'Beginner' },
      { code: 'INTM', label: 'Intermediate' },
      { code: 'ADV', label: 'Advanced' },
    ];
    levelsArray.map((level, levelId) => {
      console.log(`here 2`);
      const arr = generateArray(generateNumber(5, 8));
      console.log(`arr`, arr);
      arr.map((_, idx) => {
        console.log(`here 3`);
        skills.map(async (skill) => {
          console.log(`here 4`);
          const rd = new Date().getTime();
          const result = await Course.build({
            code: skill.name + level.code + rd,
            title: skill.name + ' ' + level.label + ' Course N°' + rd,
            skill: skill._id,
            hours: generateNumber(100, 150),
            rating: generateNumber(2, 5),
            level: levelId + 1,
          }).save();
          console.log(`result`, result);
          await Skill.updateOne(
            { name: skill.name },
            { $push: { courses: result.id } }
          );
        });
      });
    });
  }
  const resultCourses = await Course.find();
  res.json(resultCourses);
});

router.get('/generateFormations', [], async (req: Request, res: Response) => {
  formationsData.map(async (formation) => {
    const resultFormation = await Formation.build({
      title: formation.title,
      courses: [],
      image: '',
    }).save();
    await formation.courses.map(
      async ({ skill, prerequisite, aquiredLevel }) => {
        const sk = await Skill.findOne({ name: `${skill}` });
        const result = await FormationCourse.build({
          skill: sk?._id,
          prerequisite,
          aquiredLevel,
          formation: resultFormation._id,
        })
          .save()
          .then(async (result) => {
            await Formation.findByIdAndUpdate(resultFormation.id, {
              $push: { courses: result },
            });
            return result;
          });
      }
    );
    console.log('3');
  });
  console.log('4');
  const fms = await Formation.find();
  res.json(fms);
});

export { router as GeneratorRouter };
