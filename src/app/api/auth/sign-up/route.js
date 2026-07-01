import { registerUser } from "@/controllers/authController";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await registerUser(body);
    return Response.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json({ success: false, message: "Error creating account. Please try again." }, { status: 500 });
  }
}