import { DB_STRING } from "./dbConfig";
import express from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import { AuthRouter } from "./routes/auth";
import cors from "cors";

mongoose.connect(
  DB_STRING,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("connected to Database");
  }
);

const app = express();

app.use(json());
app.use(cors());
app.use("/auth", AuthRouter);

app.listen(5000, () => {
  console.log("server running");
});
