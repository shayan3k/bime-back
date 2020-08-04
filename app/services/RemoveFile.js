const fs = require("fs");
module.exports = RemoveFile = async (storePath, filename) => {
  // Unlink the prev files , done by MV internally
  if (
    (await fs.existsSync(`${storePath}${filename}`)) &&
    filename != "default.png"
  ) {
    const response = await fs.unlinkSync(`${storePath}${filename}`);
    // console.log(`${storePath}${filename}`);
    //it does not need validation
    // if (!response)
    //   return {
    //     success: false,
    //     err: true,
    //     message: ".عملیات با موفقیت انجام نشد",
    //   };

    return {
      success: true,
      err: false,
      message: "فایل با موفقیت پاک شد",
    };
  }

  return {
    success: true,
    err: false,
    message: "فایل یافت نشد",
  };
};
