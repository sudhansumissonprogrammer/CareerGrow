import fs from "fs";
import path from "path";
import multer from "multer";

const resumeDirectory = path.resolve(process.cwd(), "uploads", "resume");
if (!fs.existsSync(resumeDirectory)) {
  fs.mkdirSync(resumeDirectory, { recursive: true });
}

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, resumeDirectory),
  filename: (_req, file, cb) => {
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeOriginal}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  }
  return cb(null, true);
};

export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
