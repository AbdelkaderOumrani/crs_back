import mongoose from "mongoose";

interface ISpecialite {
  name: string;
}

interface ISpecialiteModel extends mongoose.Model<ISpecialiteDocument> {
  build(attr: ISpecialite): ISpecialiteDocument;
}

export interface ISpecialiteDocument extends mongoose.Document {
  name: string;
}

const specialiteSchema = new mongoose.Schema({
  name: {
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
