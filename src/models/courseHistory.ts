import mongoose, { ObjectId } from "mongoose";
import { ICourseDocument } from "./course";
import { IUserDocument } from "./user";

interface ICourseHistory {
  student: string | ObjectId | IUserDocument;
  course: string | ObjectId | ICourseDocument;
  term: number;
  hours: number;
  note: number;
  rating: number;
  difficulty: number;
}

interface ICourseHistoryModel extends mongoose.Model<ICourseHistoryDocument> {
  build(attr: ICourseHistory): ICourseHistoryDocument;
}

interface ICourseHistoryDocument extends mongoose.Document {
  student: string | ObjectId | IUserDocument;
  course: string | ObjectId | ICourseDocument;
  term: number;
  hours: number;
  note: number;
  rating: number;
  difficulty: number;
}

const courseHistorySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  term: {
    type: Number,
  },
  hours: {
    type: Number,
  },
  note: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  difficulty: {
    type: Number,
  },
});

courseHistorySchema.statics.build = (attr: ICourseHistory) => {
  return new CourseHistory(attr);
};

const CourseHistory = mongoose.model<
  ICourseHistoryDocument,
  ICourseHistoryModel
>("CourseHistory", courseHistorySchema);

export { CourseHistory };
