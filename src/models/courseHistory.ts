import mongoose, { ObjectId } from "mongoose";
import { ICourseDocument } from "./course";
import { IUserDocument } from "./user";

interface ICourseHistory {
  student: string | ObjectId | IUserDocument;
  course: string | ObjectId | ICourseDocument;
  term: number;
  note: number;
}

interface ICourseHistoryModel extends mongoose.Model<ICourseHistoryDocument> {
  build(attr: ICourseHistory): ICourseHistoryDocument;
}

interface ICourseHistoryDocument extends mongoose.Document {
  student: string | ObjectId | IUserDocument;
  course: string | ObjectId | ICourseDocument;
  term: number;
  note: number;
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
  note: {
    type: Number,
  },
});

courseHistorySchema.statics.build = (attr: ICourseHistory) => {
  return new courseHistory(attr);
};

const courseHistory = mongoose.model<
  ICourseHistoryDocument,
  ICourseHistoryModel
>("courseHistory", courseHistorySchema);

export { courseHistory };
