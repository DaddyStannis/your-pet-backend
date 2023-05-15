import Jimp from "jimp";

async function resizeImg(path, size = 250, quality = 60) {
  Jimp.read(path, (err, lenna) => {
    if (err) throw err;
    lenna
      .resize(size, size) // resize
      .quality(quality)
      .write(path); // save
  });
}

export default resizeImg;
