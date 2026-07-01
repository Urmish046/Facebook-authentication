import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    surname: {
      type: String,
      required: [true, "Surname is required"],
      trim: true,
    },
    emailOrMobile: {
      type: String,
      required: [true, "Mobile number or email address is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
