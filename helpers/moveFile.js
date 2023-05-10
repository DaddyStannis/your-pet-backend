import fs from "fs/promises";
import path from "path";

async function moveFile(file, dir) {
  const { path: tempUpload, filename } = file;
  const resultUpload = path.join(dir, filename);
  await fs.rename(tempUpload, resultUpload);
}

export default moveFile;
