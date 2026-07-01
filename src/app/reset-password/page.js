// app/reset-password/page.js
"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(newPassword)) {
      setError("Password must be at least 8 characters with uppercase, lowercase and a number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Password reset! Redirecting to login...");
        setTimeout(() => router.replace("/login"), 2000);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center">
        <p className="text-red-500">Invalid reset link.</p>
        <Link href="/forgot-password" className="text-[#0866FF] hover:underline text-sm mt-4 block">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="flex justify-center mb-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
          alt="Meta"
          className="h-4"
        />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h2>
      <p className="text-gray-500 text-sm mb-6">Enter a new password for your account.</p>

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
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0866FF] w-full text-black placeholder-gray-500"
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0866FF] w-full text-black placeholder-gray-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#0866FF] text-white font-bold py-3.5 rounded-full hover:bg-blue-700 transition duration-200 disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <div className="text-center mt-6">
        <Link href="/login" className="text-[#0866FF] text-sm font-medium hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}