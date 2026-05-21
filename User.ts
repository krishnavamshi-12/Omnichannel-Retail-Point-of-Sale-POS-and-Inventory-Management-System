// src/models/User.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "cashier" | "manager" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6
    },

    role: {
      type: String,
      enum: ["cashier", "manager", "admin"],
      default: "cashier"
    }
  },
  {
    timestamps: true
  }
);

// Prevent model overwrite error during development with nodemon
const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;