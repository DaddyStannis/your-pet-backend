import Jimp from "jimp";

async function resizeImg(path, size, quality) {
  Jimp.read(path, (err, lenna) => {
    if (err) throw err;
    lenna
      .resize(size, size) // resize
      .quality(quality)
      .write(path); // save
  });
}

export default resizeImg;
