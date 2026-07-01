import { resetPassword } from "@/controllers/authController";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await resetPassword(body);
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}