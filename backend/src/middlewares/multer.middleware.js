import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    const uniqueName = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname);

    cb(null, `${uniqueName}${ext}`);
  },
});

export const upload = multer({
  storage,
});