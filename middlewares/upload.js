import multer from "multer";
import path from "path";

const tmpDirPath = path.resolve("tmp");

const multerConfig = multer.diskStorage({
  destination: tmpDirPath,
  filename(req, file, cb) {
    const uniquePrefix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, `${uniquePrefix}_${file.originalname}`);
  },
});

const filetypeWhitelist = ["image/jpeg", "image/png"];

function fileFilter(req, file, cb) {
  const { mimetype } = file;

  if (filetypeWhitelist.includes(mimetype)) {
    cb(null, true);
  } else {
    cb({ message: "Invalid format. Allow only .png ot .jpg" }, false);
  }
}

const upload = multer({ storage: multerConfig, fileFilter });

export default upload;
