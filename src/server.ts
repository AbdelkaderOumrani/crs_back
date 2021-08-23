import { DB_STRING } from "./dbConfig";
import express from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import { AuthRouter } from "./routes/auth";
import cors from "cors";
import { CoursesRouter } from "./routes/courses";
import { SpecialiteRouter } from "./routes/specialite";

const PORT = process.env.PORT || 5000;

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
app.use("/specialites", SpecialiteRouter);
app.use("/auth", AuthRouter);
app.use("/courses", CoursesRouter);

app.get("/", (req, res) => {
  res.json("Hello World");
});

app.listen(PORT, () => {
  console.log("server running" + PORT);
});
