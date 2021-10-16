import mongoose, { ObjectId } from "mongoose";
import { ISkillDocument } from "./skill";
import { IStudentDocument } from "./student";

export interface IBackground {
  student: string | ObjectId | IStudentDocument;
  skill: string | ObjectId | ISkillDocument;
  level: number;
}

interface IBackgroundModel extends mongoose.Model<IBackgroundDocument> {
  build(attr: IBackground): IBackgroundDocument;
}

export interface IBackgroundDocument extends mongoose.Document {
  student: string | ObjectId | IStudentDocument;
  skill: string | ObjectId | ISkillDocument;
  level: number;
}

const backgroundSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },
  level: {
    type: Number,
  },
});

backgroundSchema.statics.build = (attr: IBackground) => {
  return new Background(attr);
};

const Background = mongoose.model<IBackgroundDocument, IBackgroundModel>(
  "Background",
  backgroundSchema
);

export { Background };
