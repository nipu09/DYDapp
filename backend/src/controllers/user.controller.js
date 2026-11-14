import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { clear } from "console";

// Generate Access Token and Refresh Token
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Use Mongoose schema methods
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token in database
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, phoneNumber } = req.body;

  // 1. Validate required fields
  if (
    [fullName, username, email, password].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "All required fields are required");
  }

  // 2. Normalize input
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedEmail = email.toLowerCase().trim();

  // 3. Check existing email
  const existingEmail = await User.findOne({
    email: normalizedEmail,
  });

  if (existingEmail) {
    throw new ApiError(409, "Email is already registered");
  }

  // 4. Check existing username
  const existingUsername = await User.findOne({
    username: normalizedUsername,
  });

  if (existingUsername) {
    throw new ApiError(409, "Username is already taken");
  }

  // 5. Get avatar path
  const avatarLocalPath = req.file?.path;

  let avatarUrl = "";

  // 6. Upload avatar
  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      throw new ApiError(500, "Avatar upload failed");
    }

    avatarUrl = avatar.secure_url;
  }

  // 7. Create user
  const user = await User.create({
    fullName: fullName.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    phoneNumber: phoneNumber || undefined,
    avatar: avatarUrl,
  });

  // 8. Get user without sensitive information
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  // 9. Send response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Validate input
  if ((!username?.trim() && !email?.trim()) || !password) {
    throw new ApiError(400, "Username or email and password are required");
  }

  // 2. Normalize input
  const Username = username?.toLowerCase().trim();
  const normalizedEmail = email?.toLowerCase().trim();

  // 3. Find user by username OR email
  const existingUser = await User.findOne({
    $or: [
      ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
      ...(Username ? [{ username: Username }] : []),
    ],
  });

  if (!existingUser) {
    throw new ApiError(404, "No user found! Register first");
  }

  // 4. Check password
  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password! Try again");
  }

  // 5. Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    existingUser._id,
  );

  // 6. Get user without sensitive information
  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken",
  );

  // 7. Cookie options
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  // 8. Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

// LOGOUT
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      returnDocument: "after",
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
