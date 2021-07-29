import mongoose from "mongoose";

interface IUser {
  fullName: string;
  email: string;
  password?: string;
  isNewUser: boolean;
}

interface IUserModel extends mongoose.Model<IUserDocument> {
  build(attr: IUser): IUserDocument;
}

interface IUserDocument extends mongoose.Document {
  fullName: string;
  email: string;
  password?: string;
  isNewUser: boolean;
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
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export { User };
