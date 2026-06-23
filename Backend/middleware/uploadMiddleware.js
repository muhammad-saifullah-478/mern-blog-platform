import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ---------------- CLOUDINARY STORAGE ----------------

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog-posts",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 1200, height: 700, crop: "fill" }],
  },
});

// ---------------- FILE FILTER ----------------

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  const isValid = allowedTypes.test(file.mimetype);

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// ---------------- MULTER INSTANCE ----------------

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// ---------------- EXPORTS ----------------

export const uploadSingle = upload.single("featuredImage");
export const uploadMultiple = upload.array("images", 5);

export default upload;