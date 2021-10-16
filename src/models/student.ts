import mongoose, { ObjectId } from 'mongoose';
import { IBackgroundDocument } from './background';
import { IFormationDocument } from './formation';

interface IStudent {
  fullName: string;
  email: string;
  password: string;
  backgrounds: string[] | ObjectId[] | IBackgroundDocument[];
  formations: string[] | ObjectId[] | IFormationDocument[];
  recommendBy: 'rating' | 'time' | 'hybrid';
  image: string;
}

interface IStudentModel extends mongoose.Model<IStudentDocument> {
  build(attr: IStudent): IStudentDocument;
}

export interface IStudentDocument extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  backgrounds: string[] | ObjectId[] | IBackgroundDocument[];
  formations: string[] | ObjectId[] | IFormationDocument[];
  recommendBy: 'rating' | 'time' | 'hybrid';
  image: string;
}

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  recommendBy: {
    type: String,
  },
  backgrounds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Background',
    },
  ],
  formations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Formation',
    },
  ],
  image: {
    type: String,
  },
});

studentSchema.statics.build = (attr: IStudent) => {
  return new Student(attr);
};

const Student = mongoose.model<IStudentDocument, IStudentModel>(
  'Student',
  studentSchema
);

export { Student };
