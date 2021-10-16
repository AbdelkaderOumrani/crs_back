import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { Student } from '../models/student';
import { Background } from '../models/background';
import { History } from '../models/history';
import { Skill } from '../models/skill';
import { Formation } from '../models/formation';

const router = express.Router();

router.post('/backgrounds', [], async (req: Request, res: Response) => {
  const email = req.body.email;
  const skill = req.body.skill;
  const level = req.body.level;
  const student = await Student.findOne({ email });
  const skillObj = await Skill.findById(skill);

  const exists = await Background.aggregate()
    .lookup({
      from: 'skills',
      localField: 'skill',
      foreignField: '_id',
      as: 'skill',
    })
    .match({ 'skill._id': mongoose.Types.ObjectId(skill) })
    .match({ student: mongoose.Types.ObjectId(student?._id) });

  console.log('email', email, 'exists');

  if (exists.length > 0) {
    res.json(false);
  } else {
    const result = await Background.build({
      student: student?._id,
      skill: skillObj?._id,
      level,
    }).save();
    console.log(`result`, result);
    if (result) {
      await Student.findOneAndUpdate(
        { email },
        { $push: { backgrounds: result._id } }
      );
      res.json(true);
    } else {
      res.json(false);
    }
  }
});

router.get('/backgrounds', [], async (req: Request, res: Response) => {
  const email = req.query.email as string;
  console.log(`email`, email);

  const backgrounds = await Background.aggregate()
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
    .unwind('student');
  // .populate("skill");

  const result = backgrounds.map((bg) => {
    return { skill: bg.skill.name, level: bg.level };
  });

  res.json(result);
});

router.post('/login', [], async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const exists = await Student.findOne({ email, password });
  if (exists) {
    res.json(exists);
  } else {
    res.json(false);
  }
});
router.post('/register', [], async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  const exists = await Student.findOne({ email });
  if (exists) {
    res.json(false);
  } else {
    const newUser = await Student.build({
      email,
      password,
      fullName,
      backgrounds: [],
      formations: [],
      recommendBy: 'rating',
      image: 'https://i.imgur.com/aJwcFoG.png',
    }).save();
    res.json(newUser);
  }
});

router.post('/formations', [], async (req: Request, res: Response) => {
  const email = req.body.email as string;
  const formation = req.body.formation as string;
  const f = await Formation.findById(formation);
  await Student.findOneAndUpdate({ email }, { $push: { formations: f?._id } });

  res.json(f);
});
router.get('/formations', [], async (req: Request, res: Response) => {
  const email = req.query.email as string;

  console.log(`email`, email);

  const student = await Student
    // .aggregate()
    // .match({ email })
    // .lookup({
    //   from: "students",
    //   localField: "student",
    //   foreignField: "_id",
    //   as: "student",
    // });

    .findOne({ email })
    .populate('formations');
  console.log(`student`, student);
  const result = student?.formations.map((f: any) => {
    return { _id: f._id, title: f.title };
  });
  console.log(`result`, result);
  res.json(result);
});

router.post('/enroll', [], async (req: Request, res: Response) => {
  const email = req.body.email;
  const formationId = req.body.formationId;

  const formation = await Formation.findById(formationId);

  await Student.updateOne({ email }, { $push: { formations: formation?._id } });

  const result = await Student.findOne({ email });
  res.json(result);
});

router.get('/enrolled', [], async (req: Request, res: Response) => {
  const email = req.query.email as string;

  console.log(`email`, email);

  const student = await Student.findOne({ email }).populate('formations');
  console.log(`student`, student);
  const result = student?.formations.map((f: any) => {
    return { _id: f._id, title: f.title };
  });
  console.log(`result`, result);
  res.json(result);
});

router.get('/histories', [], async (req: Request, res: Response) => {
  const email = req.query.email as string;

  console.log(`email`, email);
  const student = await Student.findOne({ email });

  // const history = await History.find({ student: student?._id }).populate('course');

  const history = await History.aggregate()
    .match({ student: student?._id })
    .lookup({
      from: 'courses',
      localField: 'course',
      foreignField: '_id',
      as: 'course',
    })
    .unwind('course')
    .lookup({
      from: 'skills',
      localField: 'course.skill',
      foreignField: '_id',
      as: 'skill',
    })
    .unwind('skill');

  res.json(history);
});

router.get('/settings/recommendBy', [], async (req: Request, res: Response) => {
  const email = req.query.email as string;
  const result = await Student.findOne({ email });

  res.json(result?.recommendBy);
});
router.post(
  '/settings/recommendBy',
  [],
  async (req: Request, res: Response) => {
    const { email, pref } = req.body;
    const result = await Student.updateOne({ email }, { recommendBy: pref });
    res.json(true);
  }
);

export { router as StudentRouter };
