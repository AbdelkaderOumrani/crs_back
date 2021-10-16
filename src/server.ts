import { DB_STRING } from './dbConfig';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { json } from 'body-parser';
import { StudentRouter } from './routes/student';
import cors from 'cors';
import { CoursesRouter } from './routes/courses';
import { GeneratorRouter } from './routes/generator';
import { RecommendationRouter } from './routes/recommendation';
import { DataRouter } from './routes/data';
import { FormationsRouter } from './routes/formations';
import { UploadRouter } from './routes/uploads';

const PORT = process.env.PORT || 5000;

mongoose.connect(
  DB_STRING,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('connected to Database');
  }
);

const app = express();

app.use(json());
app.use(cors());
app.use(morgan('dev'));
// app.use("/specialites", SpecialiteRouter);
app.use('/student', StudentRouter);
app.use('/courses', CoursesRouter);
app.use('/generator', GeneratorRouter);
app.use('/system', RecommendationRouter);
app.use('/data', DataRouter);
app.use('/formations', FormationsRouter);
app.use('/uploads', UploadRouter);

app.get('/', (req, res) => {
  res.json('Hello World');
});

app.listen(PORT, () => {
  console.log('server running' + PORT);
});
