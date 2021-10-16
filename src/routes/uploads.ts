import express, { Request, Response } from 'express';
import multer from 'multer';
import { Student } from '../models/student';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  const email = req.body.email;
  if (req.file) {
    const image = req.file.filename;
    await Student.updateOne({ email }, { image });
    res.json(image);
  } else {
    res.json('');
  }
});

router.get('/avatar', [], async (req: Request, res: Response) => {
  const email = req.query.email as string;
  console.log(`email`, email);
  const student = await Student.findOne({ email });
  console.log(`student`, student);
  if (student?.image) {
    const filename = student.image;
    const file = `./uploads/${filename}`;
    console.log(`file`, file);
    res.sendFile(file);
  }
});
router.get('/pdf', [], async (req: Request, res: Response) => {
  const title = req.query.title as string;
  const doc = new PDFDocument();
  // Stripping special characters
  const filename = encodeURIComponent(title.replace('N°', '')) + '.pdf';
  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  res.setHeader(
    'Content-disposition',
    'attachment; filename="' + filename + '"'
  );
  res.setHeader('Content-type', 'application/pdf');

  doc.fontSize(45);
  doc.font('Courier-Bold').text(title, 100, 100);
  doc.pipe(res);
  doc.end();
});

export { router as UploadRouter };
