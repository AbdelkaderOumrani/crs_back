import express, { Request, Response } from "express";
const router = express.Router();
import { Specialite } from "../models/specialite";
import { User } from "../models/user";
import { Course } from "../models/course";
import { CourseHistory } from "../models/courseHistory";
import { generateNumber } from "../helpers";
router.get("/generateHistory", [], async (req: Request, res: Response) => {
  const students = await User.find();
  const courses = await Course.find();

  const result: any = [];

  const studentsWithCourses = students.map((student) => {
    const optCourses = courses.filter(
      (c) => c.specialite === student.specialite && c.optional
    );
    const obgCourses = courses.filter(
      (c) => c.specialite === student.specialite && !c.optional
    );
    return {
      studentId: student.id,
      optCourses,
      obgCourses,
    };
  });

  studentsWithCourses.map(async (row, i) => {
    console.log(`i`, i);
    //Obligatoire
    row.obgCourses.map(async (crs) => {
      await CourseHistory.build({
        student: row.studentId,
        course: crs.id,
        term: crs.term,
        hours: crs.hours,
        note: crs.hours > 30 ? generateNumber(6, 15) : generateNumber(6, 20),
      }).save();
    });

    //OPtional
    const termOne = row.optCourses.filter((crs) => crs.term === 1);
    const termTwo = row.optCourses.filter((crs) => crs.term === 2);
    const termThree = row.optCourses.filter((crs) => crs.term === 3);
    const termFour = row.optCourses.filter((crs) => crs.term === 4);

    const randomFromOne = getRandom(termOne, 4);
    const randomFromTwo = getRandom(termTwo, 4);
    const randomFromThree = getRandom(termThree, 4);
    const randomFromFour = getRandom(termFour, 4);
    console.log(`randomFromOne.length`, randomFromOne.length);

    randomFromOne.map(async (crs) => {
      await CourseHistory.build({
        student: row.studentId,
        course: crs.id,
        term: crs.term,
        hours: crs.hours,
        note: crs.hours > 30 ? generateNumber(6, 15) : generateNumber(6, 20),
      }).save();
    });
    randomFromTwo.map(async (crs) => {
      await CourseHistory.build({
        student: row.studentId,
        course: crs.id,
        term: crs.term,
        hours: crs.hours,
        note: crs.hours > 30 ? generateNumber(6, 15) : generateNumber(6, 20),
      }).save();
    });
    randomFromThree.map(async (crs) => {
      await CourseHistory.build({
        student: row.studentId,
        course: crs.id,
        term: crs.term,
        hours: crs.hours,
        note: crs.hours > 30 ? generateNumber(6, 15) : generateNumber(6, 20),
      }).save();
    });
    randomFromFour.map(async (crs) => {
      await CourseHistory.build({
        student: row.studentId,
        course: crs.id,
        term: crs.term,
        hours: crs.hours,
        note: crs.hours > 30 ? generateNumber(6, 15) : generateNumber(6, 20),
      }).save();
    });
  });

  res.json(result[0]);

  // const his = await CourseHistory.build({});
});
router.get("/generateCourses", [], async (req: Request, res: Response) => {
  const listeSpec = await Specialite.find();

  //TERM 01

  listeSpec.map(async (spec) => {
    for (let index = 100; index < 108; index++) {
      await Course.build({
        code: spec.name.substring(0, 3).toUpperCase() + index,
        optional: index > 101 ? true : false,
        specialite: spec.name,
        term: 1,
        hours: generateNumber(20, 40),
      }).save();
    }
  });
  //TERM 02

  listeSpec.map(async (spec) => {
    for (let index = 200; index < 208; index++) {
      await Course.build({
        code: spec.name.substring(0, 3).toUpperCase() + index,
        optional: index > 201 ? true : false,
        specialite: spec.name,
        term: 2,
        hours: generateNumber(20, 40),
      }).save();
    }
  });
  //TERM 03

  listeSpec.map(async (spec) => {
    for (let index = 300; index < 308; index++) {
      await Course.build({
        code: spec.name.substring(0, 3).toUpperCase() + index,
        optional: index > 301 ? true : false,
        specialite: spec.name,
        term: 3,
        hours: generateNumber(20, 40),
      }).save();
    }
  });
  //TERM 04

  listeSpec.map(async (spec) => {
    for (let index = 400; index < 408; index++) {
      await Course.build({
        code: spec.name.substring(0, 3).toUpperCase() + index,
        optional: index > 401 ? true : false,
        specialite: spec.name,
        term: 4,
        hours: generateNumber(20, 40),
      }).save();
    }
  });

  const allcrs = await Course.find();

  res.json(allcrs);
});

router.get("/generateUsers", [], async (req: Request, res: Response) => {
  console.log(`here`);
  const listeSpec = await Specialite.find();
  listeSpec.map(async (spec) => {
    for (let index = 0; index < 80; index++) {
      let genDate = new Date().getTime();
      console.log(`genDate`, genDate);
      await User.build({
        email: `user${genDate}@gmail.com`,
        finished: true,
        specialite: spec._id,
        fullName: `USER${genDate}`,
        password: `${genDate}`,
        prevCourses: [],
      }).save();
    }
  });
  res.json("done");
});

export { router as GeneratorRouter };
