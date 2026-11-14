import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
     
    },

    avatar: {
      type: String,
      default: "",
    },

    phoneNumber: {
      type: String,
      default: null,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    refreshToken: {
      type: String,
      select: false,
    },

    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Unique phone number only when provided
userSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phoneNumber: { $type: "string" },
    },
  },
);

// Password hashing middleware
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 9);
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User = mongoose.model("User", userSchema);
