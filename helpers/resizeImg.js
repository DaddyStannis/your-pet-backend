import Jimp from "jimp";

async function resizeImg(path, size) {
  Jimp.read(path, (err, lenna) => {
    if (err) throw err;
    lenna
      .resize(size, size) // resize
      .write(path); // save
  });
}

export default resizeImg;
