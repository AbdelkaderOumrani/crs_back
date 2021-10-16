import mongoose, { ObjectId } from "mongoose";
import { ICourseDocument } from "./course";
export interface ISkill {
  name: string;
  courses: string[] | ObjectId[] | ICourseDocument[];
}

interface ISkillModel extends mongoose.Model<ISkillDocument> {
  build(attr: ISkill): ISkillDocument;
}

export interface ISkillDocument extends mongoose.Document {
  name: string;
  courses: string[] | ObjectId[] | ICourseDocument[];
}

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

skillSchema.statics.build = (attr: ISkill) => {
  return new Skill(attr);
};

const Skill = mongoose.model<ISkillDocument, ISkillModel>("Skill", skillSchema);

export { Skill };
