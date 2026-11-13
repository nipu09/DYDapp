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

  // 2. Check if email already exists
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw new ApiError(409, "Email is already registered");
  }

  // 3. Check if username already exists
  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    throw new ApiError(409, "Username is already taken");
  }

  // 4. Get avatar local path
  const avatarLocalPath = req.file?.path;

  // 5. Upload avatar only if provided
  let avatarUrl = null;

  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      throw new ApiError(500, "Avatar upload failed");
    }

    avatarUrl = avatar.secure_url;
  }

  // 6. Create user
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    phoneNumber,
    avatar: avatarUrl,
  });

  // 7. Fetch created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating a user");
  }

  // 8. Send response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User registered successfully",
      ),
    );
});


const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body ?? {};

  // Validate required fields
  if ((!username && !email) || !password) {
    throw new ApiError(
      400,
      "Username or email and password are required",
    );
  }

  // Find user using username or email
  const conditions = [];

  if (username?.trim()) {
    conditions.push({ username: username.trim().toLowerCase() });
  }

  if (email?.trim()) {
    conditions.push({ email: email.trim().toLowerCase() });
  }

  const user = await User.findOne({
    $or: conditions,
  }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid username/email or password");
  }

  // Verify password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid username/email or password");
  }

  // Generate access and refresh tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token in database
  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  // Get user details without password and refresh token
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  // Send response with cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged in successfully",
      ),
    );
});


export { registerUser, loginUser };