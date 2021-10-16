import mongoose, { ObjectId } from 'mongoose';
import { ICourseDocument } from './course';
import { IStudentDocument } from './student';
export interface IHistory {
  student: string | ObjectId | IStudentDocument;
  course: string | ObjectId | ICourseDocument;
  rating: number;
}

interface IHistoryModel extends mongoose.Model<IHistoryDocument> {
  build(attr: IHistory): IHistoryDocument;
}

export interface IHistoryDocument extends mongoose.Document {
  student: string | ObjectId | IStudentDocument;
  course: string | ObjectId | ICourseDocument;
  rating: number;
}

const historySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    rating: {
      type: Number,
    },
  },
  { timestamps: true }
);

historySchema.statics.build = (attr: IHistory) => {
  return new History(attr);
};

const History = mongoose.model<IHistoryDocument, IHistoryModel>(
  'History',
  historySchema
);

export { History };
