import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

const ALLOWED_FORMATS = ["jpeg", "png"];

cloudinary.v2.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  folder: "photos",
  allowedFormats: ALLOWED_FORMATS,
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, `${uniquePrefix}_${file.originalname}`);
  },
});

const uploadCloud = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileExtension =
      file.originalname.split(".")[file.originalname.split(".").length - 1];

    if (!ALLOWED_FORMATS.includes(fileExtension)) {
      return cb({ message: "Invalid format. Allow only .png or .jpg" }, false);
    }

    cb(null, true);
  },
});

export default uploadCloud;
