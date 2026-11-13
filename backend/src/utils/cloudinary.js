import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    console.log("File uploaded successfully:", response.secure_url);

    return response;

  } catch (error) {
    console.log("Cloudinary Error:", error.message);
    return null;

  } finally {
    // Always delete the temporary file
    try {
      await fs.promises.unlink(localFilePath);
      console.log("Temporary file deleted successfully");
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.log("Temporary file deletion failed:", error.message);
      }
    }
  }
};

export { uploadOnCloudinary };