import multer from "multer";
import path from "path";
import fs from "fs";

["uploads", "uploads/files", "uploads/images"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

//저장경로 파일 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "files") cb(null, "uploads/files/");
    else if (file.fieldname === "images") cb(null, "uploads/images/");
    else cb(null, "uploads/others/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

const upload = multer({ storage });

export default upload;
