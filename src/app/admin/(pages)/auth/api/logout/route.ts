import { NextRequest, NextResponse } from "next/server";
import { verifyCSRFToken } from "@/lib/auth/csrf";
import { getSession, deleteSession } from "@/lib/config/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csrfToken } = body;

    // Verify CSRF token
    const isValidCSRF = await verifyCSRFToken(csrfToken);
    if (!isValidCSRF) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Get current session
    const session = await getSession();

    if (session) {
      await deleteSession(session.sessionId);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
