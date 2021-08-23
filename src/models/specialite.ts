import mongoose from "mongoose";

export interface ISpecialite {
  parent?: string;
  code: string;
  name: string;
}

interface ISpecialiteModel extends mongoose.Model<ISpecialiteDocument> {
  build(attr: ISpecialite): ISpecialiteDocument;
}

export interface ISpecialiteDocument extends mongoose.Document {
  parent?: string;
  code: string;
  name: string;
}

const specialiteSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  parent: {
    type: String,
  },
});

specialiteSchema.statics.build = (attr: ISpecialite) => {
  return new Specialite(attr);
};

const Specialite = mongoose.model<ISpecialiteDocument, ISpecialiteModel>(
  "Specialite",
  specialiteSchema
);

export { Specialite };
