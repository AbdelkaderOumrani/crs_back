import express, { Request, Response } from "express";
const router = express.Router();
import { Specialite } from "../models/specialite";
import { User } from "../models/user";
import { Course } from "../models/course";
import { CourseHistory } from "../models/courseHistory";
import { generateNumber } from "../helpers";

router.get("/recommend", [], async (req: Request, res: Response) => {
  const email = req.query.email as string;
  const user = await User.findOne({ email }).populate("prevCourses");
  if (user) {
    if (user.prevCourses?.length === 0) {
      const histByHours = await CourseHistory.aggregate()
        .lookup({
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student",
        })
        .match({
          "student.specialite": user.specialite,
        })

        .lookup({
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        })
        .sort({ "course.term": 1 })
        .group({
          _id: "$student._id",
          // student: { $push: "$student" },
          sum_hours: { $sum: "$hours" },
          courses: { $push: "$course" },
        })
        .sort({
          sum_hours: 1,
        })
        .limit(1)
        .then((res) => {
          return {
            type: "NEW",
            courses: res[0].courses.map((crs: any) => crs[0]),
            sum_hours: res[0].sum_hours,
          };
        })
        .catch((err) => {
          console.log("error", err);
          return {};
        });
      const histByMoy = await CourseHistory.aggregate()
        .lookup({
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student",
        })
        .match({
          "student.specialite": user.specialite,
        })

        .lookup({
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        })
        .sort({ "course.term": 1 })
        .group({
          _id: "$student._id",
          // student: { $push: "$student" },
          avg: { $avg: "$note" },
          courses: { $push: "$course" },
        })
        .sort({
          avg: -1,
        })
        .limit(1)
        .then((res) => {
          console.log(res.length);
          return {
            type: "NEW",
            courses: res[0].courses.map((crs: any) => crs[0]),
            avg: res[0].avg,
          };
        })
        .catch((err) => {
          console.log("error", err);
          return {};
        });
      res.json({ histByHours, histByMoy });
    } else {
      const simHours = await CourseHistory.aggregate()
        .lookup({
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student",
        })
        .match({
          "student.specialite": user.specialite,
        })

        .lookup({
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        })
        .sort({ "course.term": 1 })
        .group({
          _id: "$student._id",
          // student: { $push: "$student" },
          sum_hours: { $sum: "$hours" },
          courses: { $push: "$course" },
        })
        .sort({
          avg: 1,
        })
        .limit(20)
        .then(async (res: any[]) => {
          const similarities = { sim: 0, courses: [], sum_hours: 0 };
          // data.histByHours[0].courses.map
          const prev = user.prevCourses.map((crs: any) => crs.code as string);
          res.map((etudiant) => {
            if (user.prevCourses) {
              const studentCourses = etudiant.courses.map(
                (crs: any) => crs[0].code
              );
              // console.log(`prev`, prev);
              // console.log(`studentCourses`, studentCourses);
              const total = count_similarities(prev, studentCourses);
              console.log(
                "total",
                Math.floor((total / 24) * 100),
                "avg",
                etudiant.sum_hours
              );
              if (
                total > similarities.sim ||
                (total === similarities.sim &&
                  etudiant.sum_hours < similarities.sum_hours)
              ) {
                similarities.sim = Math.floor((total / 24) * 100);
                similarities.courses = studentCourses;
                similarities.sum_hours = etudiant.sum_hours;
              }
            }
          });
          const intersection = similarities.courses.filter(
            (crs) => prev.findIndex((str) => str === crs) < 0
          );

          const resultCourses = await Course.find({
            code: { $in: intersection },
            term: { $gte: detectTerm(prev.length) },
          }).sort({ term: 1 });
          // console.log(`resultCourses`, resultCourses);
          return {
            type: "OLD",
            similiarity: similarities.sim,
            sum_hours: similarities.sum_hours,
            courses: resultCourses,
          };
        })
        .catch((err) => {
          console.log("error", err);
          return {};
        });
      const simMoy = await CourseHistory.aggregate()
        .lookup({
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student",
        })
        .match({
          "student.specialite": user.specialite,
        })

        .lookup({
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        })
        .sort({ "course.term": 1 })
        .group({
          _id: "$student._id",
          // student: { $push: "$student" },
          avg: { $avg: "$note" },
          courses: { $push: "$course" },
        })
        .sort({
          avg: -1,
        })
        .limit(20)
        .then(async (res: any[]) => {
          const similarities = { sim: 0, courses: [], avg: 0 };
          const prev = user.prevCourses.map((crs: any) => crs.code as string);
          // data.histByHours[0].courses.map
          res.map((etudiant) => {
            if (user.prevCourses) {
              const studentCourses = etudiant.courses.map(
                (crs: any) => crs[0].code
              );
              // console.log(`prev`, prev);
              // console.log(`studentCourses`, studentCourses);
              const total = count_similarities(prev, studentCourses);
              console.log(
                "total",
                Math.floor((total / 24) * 100),
                "avg",
                etudiant.avg
              );
              if (
                total > similarities.sim ||
                (total === similarities.sim && etudiant.avg > similarities.avg)
              ) {
                similarities.sim = Math.floor((total / 24) * 100);
                similarities.courses = studentCourses;
                similarities.avg = etudiant.avg;
              }
            }
          });
          console.log(`similarities.courses`, similarities.courses);
          const intersection = similarities.courses.filter(
            (crs) => prev.findIndex((str) => str === crs) < 0
          );

          const resultCourses = await Course.find({
            code: { $in: intersection },
            term: { $gte: detectTerm(prev.length) },
          }).sort({ term: 1 });
          return {
            type: "OLD",
            similiarity: similarities.sim,
            avg: similarities.avg,
            courses: resultCourses,
          };
        })
        .catch((err) => {
          console.log("error", err);
          return {};
        });
      res.json({ histByHours: simHours, histByMoy: simMoy });
    }
  }
});

export { router as RecommendationRouter };
