const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".jpe",
  ".jfif",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".svg",
  ".ico",
  ".tif",
  ".tiff",
  ".heic",
  ".heif",
  ".avif",
  ".apng",
  ".raw",
  ".cr2",
  ".nef",
  ".arw",
  ".dng",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e4)}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isImageMime = file.mimetype && file.mimetype.startsWith("image/");
  const isAllowedExt = ALLOWED_EXTENSIONS.has(ext);

  if (isImageMime || isAllowedExt) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
