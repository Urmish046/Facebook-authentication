"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,15}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    emailOrMobile: "",
    newPassword: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.firstName.trim() || !formData.surname.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) {
      setError("Please select your complete date of birth.");
      return false;
    }
    if (!formData.gender) {
      setError("Please select your gender.");
      return false;
    }
    const isEmail = emailRegex.test(formData.emailOrMobile);
    const isPhone = phoneRegex.test(formData.emailOrMobile);
    if (!isEmail && !isPhone) {
      setError("Please enter a valid email address or mobile number.");
      return false;
    }
    if (!passwordRegex.test(formData.newPassword)) {
      setError("Password must be at least 8 characters with uppercase, lowercase and a number.");
      return false;
    }
    return true;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    const dateOfBirth = new Date(
      `${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`
    );

    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          surname: formData.surname,
          emailOrMobile: formData.emailOrMobile,
          password: formData.newPassword,
          dateOfBirth,
          gender: formData.gender,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong. Please try again.");
      } else {
        router.replace("/login");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-4 text-black text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400";
  const selectClass =
    "w-full border border-gray-300 rounded-xl px-4 py-4 text-black text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ";
  const labelClass = "block text-[15px] font-semibold text-gray-900 mb-2";

  return (
    <div className="min-h-screen bg-white w-full max-w-2xl mx-auto px-6 py-8">
      {/* Back arrow + Meta logo */}
      <div className="mb-6">
        <Link
          href="/login"
          className="text-gray-500 text-3xl mb-4 hover:text-gray-800 transition"
        >
          ‹
        </Link>{" "}
        <div className="flex items-center gap-1 mb-5">
          <div className="flex justify-center items-center mt-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
              alt="Meta"
              className="h-4"
            />
          </div>
        </div>
        <h1 className="text-[28px] font-bold text-gray-900 leading-tight">
          Get started on Facebook
        </h1>
        <p className="text-gray-500 text-[15px] mt-2 leading-snug">
          Create an account to connect with friends, family and communities of
          people who share your interests.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSignupSubmit} className="space-y-6">
        <div>
          <label className={labelClass}>Name</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
              required
            />
            <input
              type="text"
              name="surname"
              placeholder="Surname"
              value={formData.surname}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Date of birth <span className="text-gray-400 font-normal">ⓘ</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div className="relative">
              <select
                name="dobDay"
                value={formData.dobDay}
                onChange={handleChange}
                className={selectClass}
                required
              >
                <option value="" disabled>Day</option>
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                name="dobMonth"
                value={formData.dobMonth}
                onChange={handleChange}
                className={selectClass}
                required
              >
                <option value="" disabled>Month</option>
                {months.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                name="dobYear"
                value={formData.dobYear}
                onChange={handleChange}
                className={selectClass}
                required
              >
                <option value="" disabled>Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Gender <span className="text-gray-400 font-normal">ⓘ</span>
          </label>
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={selectClass}
              required
            >
              <option value="" disabled>Select your gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Mobile number or email address</label>
          <input
            type="text"
            name="emailOrMobile"
            placeholder="Mobile number or email address"
            value={formData.emailOrMobile}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <p className="text-[13px] text-gray-500 mt-2">
            You may receive notifications from us.{" "}
            <Link href="#" className="text-blue-600 font-medium hover:underline">
              Learn why we ask for your contact information
            </Link>
          </p>
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Password"
              value={formData.newPassword}
              onChange={handleChange}
              className={`${inputClass} pr-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.69-1.64 1.78-3.12 3.17-4.32" />
                  <path d="M10.58 10.58A2 2 0 1 0 13.42 13.42" />
                  <path d="M9.88 5.08A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-1.16 2.76-3.21 5.18-5.88 6.72" />
                  <path d="M1 1l22 22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M2.1 12a11.5 11.5 0 0 1 19.8 0 11.5 11.5 0 0 1-19.8 0Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3 text-[13px] text-gray-600 leading-snug">
          <p>
            People who use our service may have uploaded your contact
            information to Facebook.{" "}
            <Link href="#" className="text-blue-600 hover:underline">Learn more</Link>.
          </p>
          <p>
            By tapping Submit, you agree to create an account and to Facebook's{" "}
            <Link href="#" className="text-blue-600 hover:underline">Terms</Link>,{" "}
            <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-600 hover:underline">Cookies Policy</Link>.
          </p>
          <p>
            The{" "}
            <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>{" "}
            describes the ways we can use the information we collect when you
            create an account. For example, we use this information to provide,
            personalise and improve our products, including ads.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1877F2] text-white font-semibold py-4 rounded-xl text-base hover:bg-blue-700 transition duration-200 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Submit"}
        </button>

        <Link href="/login">
          <button
            type="button"
            className="w-full border border-gray-300 text-gray-900 font-medium py-4 rounded-xl text-base hover:bg-gray-50 transition duration-200 mt-2"
          >
            I already have an account
          </button>
        </Link>
      </form>
    </div>
  );
}