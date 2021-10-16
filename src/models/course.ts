import mongoose, { ObjectId } from "mongoose";
import { ISkill } from "./skill";

interface ICourse {
  code: string;
  title: string;
  skill: string | ObjectId | ISkill;
  hours: number;
  rating: number;
  level: number;
}

interface ICourseModel extends mongoose.Model<ICourseDocument> {
  build(attr: ICourse): ICourseDocument;
}

export interface ICourseDocument extends mongoose.Document {
  code: string;
  title: string;
  skill: string | ObjectId | ISkill;
  hours: number;
  rating: number;
  level: number;
}

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  title: {
    type: String,
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },
  hours: {
    type: Number,
  },
  rating: { type: Number },
  level: { type: Number },
});

courseSchema.statics.build = (attr: ICourse) => {
  return new Course(attr);
};

const Course = mongoose.model<ICourseDocument, ICourseModel>(
  "Course",
  courseSchema
);

export { Course };
