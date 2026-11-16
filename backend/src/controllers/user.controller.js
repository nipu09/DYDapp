import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { clear, log } from "console";

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
    throw new ApiError(401, "No user found");
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

// REFRESH ACCESS TOKEN
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or already used");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken,
        },
        "Access token refreshed successfully",
      ),
    );
});

// GET USER DETAILS
const userDetails = asyncHandler(async (req, res) => {
  const user = req.user;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
      "Current user details fetched successfully",
    ),
  );
});

//..................Update>....................................

// Change Current Password

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    // Validate new password
    if (newPassword.length < 8) {
        throw new ApiError(400, "New password must be at least 8 characters long");
    }

    // Find user
    const user = await User.findById(req.user._id ?? req.user.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check old password
    const checkPassword = await user.isPasswordCorrect(oldPassword);

    if (!checkPassword) {
        throw new ApiError(400, "Invalid old password");
    }

    // Prevent using the same password
    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password must be different from old password");
    }

    // Update password
    user.password = newPassword;

    // Clear stored refresh token (logout other devices)
    user.refreshToken = undefined;

    // Save with schema validation enabled
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully. Please log in.")
    );
});


//UPDATE USER AVATAR
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // Upload new avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar?.url) {
    throw new ApiError(400, "Error while uploading avatar. Try again");
  }

  // Get old avatar URL
  const userOldAvatarUrl = req.user?.avatar;

  // Update user avatar
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      returnDocument: "after",
    },
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete old avatar if it exists
  if (userOldAvatarUrl) {
    await deleteOnCloudinary(userOldAvatarUrl);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  userDetails,
  updateUserAvatar,
};
