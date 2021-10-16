import { IFormationCourseDocument } from './formationCourse';
import mongoose, { ObjectId } from 'mongoose';
import { ICourseDocument } from './course';

export interface IFormation {
  title: string;
  courses: IFormationCourseDocument[];
  image: string;
}
interface IFormationModel extends mongoose.Model<IFormationDocument> {
  build(attr: IFormation): IFormationDocument;
}

export interface IFormationDocument extends mongoose.Document {
  title: string;
  courses: IFormationCourseDocument[];
  image: string;
}
const formationSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FormationCourse',
    },
  ],
  image: {
    type: String,
  },
});

formationSchema.statics.build = (attr: IFormation) => {
  return new Formation(attr);
};

const Formation = mongoose.model<IFormationDocument, IFormationModel>(
  'Formation',
  formationSchema
);

export { Formation };
