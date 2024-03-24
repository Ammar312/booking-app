import multer from "multer";
import fs from "fs";

// Function to ensure that the uploads directory exists
const ensureUploadsDirectory = () => {
  const uploadsDir = "./uploads";
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
};

// Call the function to ensure uploads directory exists
ensureUploadsDirectory();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage, limits: { fileSize: 1000000 } });

export default upload;
