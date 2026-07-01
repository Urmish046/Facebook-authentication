"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,15}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export default function LoginForm() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const isEmail = emailRegex.test(emailOrPhone);
    const isPhone = phoneRegex.test(emailOrPhone);

    if (!isEmail && !isPhone) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters with uppercase, lowercase and a number.",
      );
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailOrMobile: emailOrPhone,
        password,
      }),
    });

    const result = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(result.message || "Invalid email or password.");
    } else {
      router.replace("/home");
    }
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-black">Log in to Facebook</h2>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Email address"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          className="px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent w-full text-black placeholder-gray-500"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3.5 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent w-full text-black placeholder-gray-500"
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

        <button
          type="submit"
          disabled={loading}
          className="bg-[#0866FF] text-white font-bold py-3.5 rounded-full hover:bg-blue-700 transition duration-200 mt-2 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="text-center mt-5">
        <Link
          href="/forgot-password"
          className="text-black hover:underline text-sm font-medium"
        >
          Forgotten password?
        </Link>
      </div>

      <div className="mt-8 mb-10">
        <Link
          href="/signup"
          className="block text-center border border-[#0866FF] text-[#0866FF] font-bold py-3.5 rounded-full hover:bg-blue-50 transition duration-200"
        >
          Create new account
        </Link>
      </div>

      <div className="flex justify-center items-center mt-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
          alt="Meta"
          className="h-4"
        />
      </div>
    </div>
  );
}
