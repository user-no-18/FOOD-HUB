import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    // prefix with timestamp to avoid filename collisions
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
export const upload = multer({ storage });
