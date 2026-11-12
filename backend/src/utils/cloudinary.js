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

    // Upload image to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    console.log("File uploaded successfully:", response.url);

    // Remove local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;

  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Remove local file if upload fails
    if (localFilePath && fs.existsSync(localFilePath)) { 
        
    //remove the localy saved image as the upload operation failed
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };