import mongoose from "mongoose";

interface IUser {
  fullName: string;
  email: string;
  password: string;
  isNewUser: boolean;
  specialite: string;
  finished: boolean;
}

interface IUserModel extends mongoose.Model<IUserDocument> {
  build(attr: IUser): IUserDocument;
}

export interface IUserDocument extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  isNewUser: boolean;
  specialite: string;
  finished: boolean;
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
  isNewUser: {
    type: Boolean,
  },
  specialite: {
    type: String,
  },
  finished: {
    type: String,
  },
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export { User };
