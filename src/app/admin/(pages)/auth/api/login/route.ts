import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/config/database";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/config/session";
import {
  checkRateLimit,
  recordSuccessfulLogin,
} from "@/lib/auth/rate-limit";
import { verifyCSRFToken, getCSRFHeaderName } from "@/lib/auth/csrf";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, csrfToken } = body;

    // Validate input
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Verify CSRF token
    const isValidCSRF = await verifyCSRFToken(csrfToken);
    if (!isValidCSRF) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Get IP address for rate limiting
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    const rateLimitResult = await checkRateLimit(ipAddress);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many failed attempts. Please try again later.",
          blockedUntil: rateLimitResult.blockedUntil,
        },
        { status: 429 }
      );
    }

    // Get admin user
    const admin = await prisma.admin.findFirst();

    if (!admin) {
      return NextResponse.json(
        { error: "Admin account not found" },
        { status: 500 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          error: "Invalid password",
          remainingAttempts: rateLimitResult.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Record successful login
    await recordSuccessfulLogin(ipAddress);

    // Create session
    await createSession(admin.id);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user is authenticated
export async function GET(request: NextRequest) {
  try {
    const session = await prisma.session.findFirst({
      where: {
        id: request.cookies.get("admin_session")?.value,
      },
    });

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { authenticated: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}
