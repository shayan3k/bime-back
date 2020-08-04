const fs = require("fs");
module.exports = ImageUpload = async (
  req,
  uploadedImage,
  prevFileName,
  storePath
) => {
  if (!req.files || !uploadedImage)
    return {
      success: false,
      err: true,
      message: "فایلی برای آپلود انتخاب نشده است",
    };

  let filename = prevFileName;
  let arr = uploadedImage.name.split(".");
  let extention = arr[arr.length - 1];

  let mime = uploadedImage.mimetype.split("/");
  if (
    mime[0] != "image" &&
    !(
      extention == "jpg" ||
      extention == "jpeg" ||
      extention == "png" ||
      extention == "gif"
    )
  )
    return {
      success: false,
      err: true,
      message: "فایلی انتخابی برای آپلود از نوع عکس نیست.",
    };

  // const theImage = await sharp(uploadedImage.data)
  //   .resize(100, 100)
  //   .toFormat("jpeg")
  //   .toBuffer();

  // const theImage = await sharp({
  //   create: {
  //     width: 48,
  //     height: 48,
  //     channels: 4,
  //     background: { r: 255, g: 0, b: 0, alpha: 0.5 },
  //   },
  // })
  //   .png()
  //   .toBuffer();

  // uploadedImage.data = theImage;

  // Unlink the prev files , done by MV internally
  if (await fs.existsSync(`${storePath}${filename}.${extention}`))
    await fs.unlinkSync(`${storePath}${filename}.${extention}`);

  // Use the mv() method to place the file somewhere on your server
  await uploadedImage.mv(`${storePath}${filename}.${extention}`, (err) => {
    if (err) {
      return {
        success: false,
        err: true,
        message: err.response,
      };
    }
  });

  return {
    success: true,
    err: false,
    message: "عکس با موفقیت بارگزاری شد",
    image: `${filename}.${extention}`,
  };
};
