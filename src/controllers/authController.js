import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { normalizeEmailOrMobile, normalizeEmail, emailRegex } from "@/lib/validators";

const resend = new Resend(process.env.RESEND_API_KEY);

// ---- Login ----
export async function loginUser({ emailOrMobile, password }) {
  await dbConnect();

  const normalized = normalizeEmailOrMobile(emailOrMobile);
  const user = await UserModel.findOne({ emailOrMobile: normalized });

  if (!user) {
    return { status: 404, body: { success: false, message: "No user found with this email." } };
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return { status: 401, body: { success: false, message: "Incorrect password." } };
  }

  const token = jwt.sign(
    {
      _id: user._id.toString(),
      firstName: user.firstName,
      surname: user.surname,
      emailOrMobile: user.emailOrMobile,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    status: 200,
    body: {
      success: true,
      message: "Login successful!",
      token,
    },
  };
}

// ---- Sign Up ----
export async function registerUser({ firstName, surname, emailOrMobile, password, dateOfBirth, gender }) {
  await dbConnect();

  const normalized = normalizeEmailOrMobile(emailOrMobile);
  const existingUser = await UserModel.findOne({ emailOrMobile: normalized });

  if (existingUser) {
    return { status: 400, body: { success: false, message: "An account with this email or mobile number already exists." } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    firstName,
    surname,
    emailOrMobile: normalized,
    password: hashedPassword,
    dateOfBirth,
    gender,
  });

  await newUser.save();

  return { status: 201, body: { success: true, message: "Account created successfully!" } };
}

// ---- Forgot Password ----
export async function requestPasswordReset({ email }) {
  await dbConnect();

  const normalizedEmail = normalizeEmail(email);

  if (!emailRegex.test(normalizedEmail)) {
    return { status: 400, body: { success: false, message: "Please enter a valid email address." } };
  }

  const user = await UserModel.findOne({ emailOrMobile: normalizedEmail });
  if (!user) {
    return { status: 404, body: { success: false, message: "No account found with this email address." } };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: normalizedEmail,
    subject: "Reset your Facebook password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Reset your password</h2>
        <p>You requested a password reset for your Facebook account.</p>
        <a href="${resetUrl}" style="display:inline-block; background:#1877F2; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
          Reset Password
        </a>
        <p style="margin-top:16px; color:#888; font-size:13px;">
          This link expires in 1 hour. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });

  return { status: 200, body: { success: true, message: "Reset link sent!" } };
}

// ---- Reset Password ----
export async function resetPassword({ token, email, newPassword }) {
  await dbConnect();

  if (!token || !email || !newPassword) {
    return { status: 400, body: { success: false, message: "Invalid or expired reset link." } };
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const normalizedEmail = normalizeEmail(email);

  const user = await UserModel.findOne({
    emailOrMobile: normalizedEmail,
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: new Date() },
  });

  if (!user) {
    return { status: 400, body: { success: false, message: "Invalid or expired reset link." } };
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  await user.save();

  return { status: 200, body: { success: true, message: "Password reset successfully!" } };
}