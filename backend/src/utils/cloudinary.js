import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


function extractPublicId(imageUrl) {
  // Matches everything after '/upload/' (skipping transformations and version numbers like v1712345678/)
  // up to the file extension
  const regex = /\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(.+?)\.[^.]+$/;
  const match = imageUrl.match(regex);
  return match ? match[1] : null;
}

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

const deleteOnCloudinary = async (imageUrl) => {
  try {
    const publicId = extractPublicId(imageUrl);

    if (!publicId) {
      throw new Error('Could not extract a valid public_id from the provided URL.');
    }

    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    console.log(`Deleted (${publicId}):`, result); // { result: 'ok' }
    return result;
  } catch (error) {
    console.error('Error deleting image by URL:', error);
    throw error;
  }
}
export { uploadOnCloudinary, deleteOnCloudinary };