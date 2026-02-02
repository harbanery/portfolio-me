import { NextResponse } from "next/server";
import { generateCSRFToken } from "@/lib/auth/csrf";

export async function GET() {
  try {
    const token = await generateCSRFToken();

    return NextResponse.json(
      {
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
