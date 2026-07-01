// app/forgot-password/page.js
"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Reset link sent! Check your inbox.");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
            alt="Meta"
            className="h-4"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0866FF] w-full text-black placeholder-gray-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#0866FF] text-white font-bold py-3.5 rounded-full hover:bg-blue-700 transition duration-200 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-[#0866FF] text-sm font-medium hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}