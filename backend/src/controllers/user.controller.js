import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, phoneNumber } = req.body;

  // 1. Check required fields
  if (
    [fullName, username, email, password].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "All required fields are required");
  }

  // 2. Check existing user
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already registered with username or email");
  }

//   // 3. Get avatar local path
//   const avatarLocalPath = req.file?.path;

//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar is required");
//   }

//   // 4. Upload avatar to Cloudinary
//   const avatar = await uploadOnCloudinary(avatarLocalPath);

//   if (!avatar) {
//     throw new ApiError(400, "Avatar upload failed, something went wrong");
//   }

  // 5. Create user
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    phoneNumber,
    // avatar: avatar.secure_url,
  });

  // 6. Fetch created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating a user");
  }

  // 7. Send response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
