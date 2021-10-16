import mongoose, { ObjectId } from "mongoose";
import { ICourseDocument } from "./course";
import { IFormationDocument } from "./formation";
import { ISkillDocument } from "./skill";
export interface IFormationCourse {
  skill: string | ObjectId | ISkillDocument;
  aquiredLevel: number;
  prerequisite: number;
  formation: string | ObjectId | IFormationDocument;
}

export interface IFormationCourseModel
  extends mongoose.Model<IFormationCourseDocument> {
  build(attr: IFormationCourse): IFormationCourseDocument;
}

export interface IFormationCourseDocument extends mongoose.Document {
  skill: string | ObjectId | ISkillDocument;
  aquiredLevel: number;
  prerequisite: number;
  formation: string | ObjectId | IFormationDocument;
}

const formationCourseSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },
  aquiredLevel: {
    type: Number,
  },
  prerequisite: {
    type: Number,
  },
  formation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Formation",
  },
});

formationCourseSchema.statics.build = (attr: IFormationCourse) => {
  return new FormationCourse(attr);
};

const FormationCourse = mongoose.model<
  IFormationCourseDocument,
  IFormationCourseModel
>("FormationCourse", formationCourseSchema);

export { FormationCourse };
