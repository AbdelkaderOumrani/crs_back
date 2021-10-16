import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { Course, ICourseDocument } from '../models/course';
import { CourseHistory } from '../models/courseHistory';
import { Specialite } from '../models/specialite';
import { User } from '../models/user';
import { count_similarities, detectTerm, generateNumber } from '../helpers';
import { History } from '../models/history';
import { Student } from '../models/student';
import { Background } from '../models/background';
import { ISkill } from '../models/skill';

function getRandom(arr: any, n: number) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available');
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const router = express.Router();

router.get('/all', [], async (req: Request, res: Response) => {
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
router.get('/allHistory', [], async (req: Request, res: Response) => {
  const result = await CourseHistory.find().limit(100).populate('course');
  res.json(result);
});

router.post('/:courseId/rate', [], async (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  const rating = req.body.rating as number;
  const newRating = req.body.newRating as number;
  const email = req.body.email as string;
  const student = await Student.findOne({ email });
  //UPDATE COURSE RATING
  await Course.findByIdAndUpdate(courseId, {
    rating: (rating + newRating) / 2,
  });

  //ADD TO HISTORY

  const resultCourse = await Course.findById(courseId);
  console.log('resultCourse', resultCourse);
  if (student && resultCourse) {
    const history = await History.build({
      student: student._id,
      course: resultCourse._id,
      rating: newRating,
    }).save();
    console.log('history', history);
    console.log('hello');
  }

  //ADD TO STUDENT BACKGROUND
  if (student && resultCourse) {
    console.log('student :>> ', student);
    console.log('resultCourse :>> ', resultCourse);
    const background = await Background.findOne({
      student: student._id,
      skill: resultCourse.skill,
    });
    //Background Exists
    if (background) {
      await Background.findOneAndUpdate(
        { student: student._id, skill: resultCourse.skill },
        {
          level:
            resultCourse.level > background.level
              ? resultCourse.level
              : background.level,
        }
      );
    } else {
      await Background.build({
        student: student._id,
        skill: resultCourse.skill as string,
        level: resultCourse.level,
      }).save();
    }
  }
  res.json(true);
});

export { router as CoursesRouter };
