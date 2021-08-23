import mongoose from "mongoose";

interface ICourse {
  code: string;
  title: string;
  term: number;
  optional: boolean;
  specialite: string;
  hours: number;
  rating: number;
  difficulty: number;
}

interface ICourseModel extends mongoose.Model<ICourseDocument> {
  build(attr: ICourse): ICourseDocument;
}

export interface ICourseDocument extends mongoose.Document {
  code: string;
  title: string;
  term: number;
  optional: boolean;
  specialite: string;
  hours: number;
  rating: number;
  difficulty: number;
}

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  title: {
    type: String,
  },
  term: {
    type: Number,
  },
  hours: {
    type: Number,
  },
  optional: {
    type: Boolean,
  },
  specialite: {
    type: String,
  },
  rating: { type: Number },
  difficulty: { type: Number },
});

courseSchema.statics.build = (attr: ICourse) => {
  return new Course(attr);
};

const Course = mongoose.model<ICourseDocument, ICourseModel>(
  "Course",
  courseSchema
);

export { Course };
