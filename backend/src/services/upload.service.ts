import multerS3 from 'multer-s3';
import multer from 'multer';
import path from 'path';
import s3Client from '../config/s3.cofig';

const createUploadService = (folder: string) => {
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.S3_BUCKET_NAME || '',
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const fileName = `${folder}/${Date.now()}-${file.originalname}`;
        cb(null, fileName);
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = /pdf|doc|docx|image|jpg/;
      const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedFileTypes.test(file.mimetype);

      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only pdf, doc, docx, jpg files are allowed!'));
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024 
    }
  });
};

export default createUploadService;
