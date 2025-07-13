import path from 'path';
import multer from 'multer';

// Define the upload path using process.cwd() and the relative path to the images folder
const uploadPath = path.join(process.cwd(), '../font-web/web-app/public/images');

// Optional: Log the upload path to verify it's correct
console.log('Upload path:', uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

export default upload;