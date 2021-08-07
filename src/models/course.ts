import mongoose from "mongoose";

interface ICourse {
  code: string;
  title: string;
  term: number;
  optional: boolean;
  specialities: string;
}

interface ICourseModel extends mongoose.Model<ICourseDocument> {
  build(attr: ICourse): ICourseDocument;
}

export interface ICourseDocument extends mongoose.Document {
  code: string;
  title: string;
  term: number;
  optional: boolean;
  specialities: string;
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
  optional: {
    type: Boolean,
  },
  specialities: {
    type: String,
  },
});

courseSchema.statics.build = (attr: ICourse) => {
  return new Course(attr);
};

const Course = mongoose.model<ICourseDocument, ICourseModel>(
  "Course",
  courseSchema
);

export { Course };
