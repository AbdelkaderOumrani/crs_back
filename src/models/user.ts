import mongoose, { ObjectId } from "mongoose";
import { ICourseDocument } from "./course";
import { ISpecialiteDocument } from "./specialite";

interface IUser {
  fullName: string;
  email: string;
  password: string;
  specialite: string | ObjectId | ISpecialiteDocument;
  finished: boolean;
  prevCourses: string[] | ObjectId[] | ICourseDocument[];
}

interface IUserModel extends mongoose.Model<IUserDocument> {
  build(attr: IUser): IUserDocument;
}

export interface IUserDocument extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  specialite: string | ObjectId | ISpecialiteDocument;
  finished: boolean;
  prevCourses: string[] | ObjectId[] | ICourseDocument[];
}

const userSchema = new mongoose.Schema({
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
  specialite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialite",
  },
  finished: {
    type: Boolean,
  },
  prevCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export { User };
