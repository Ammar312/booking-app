import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCloudinary = async (fileBuffer) => {
  try {
    if (!fileBuffer) {
      return null;
    }
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(fileBuffer, {
      resource_type: "auto",
    });
    // fs.unlinkSync(filepath);
    return response;
  } catch (error) {
    // fs.unlinkSync(filepath);
    console.log("cloud error", error);
    return null;
  }
};

export const deleteImgCloudinary = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    console.log("deleteImg", response);
    return response;
  } catch (error) {
    console.log("deleteIMGERROR", error);
  }
};
