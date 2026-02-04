import { cookies } from "next/headers";
import { NODE_ENV } from "../config/variables";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

export async function generateCSRFToken(): Promise<string> {
  const token = crypto.randomUUID();

  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Client needs to read this
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 2, // 2 hours
    path: "/",
  });

  return token;
}

export async function verifyCSRFToken(
  headerToken: string | null,
): Promise<boolean> {
  if (!headerToken) {
    return false;
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  return headerToken === cookieToken;
}

export async function getCSRFToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value ?? null;
}

export async function refreshCSRFToken(): Promise<string> {
  return generateCSRFToken();
}

export function getCSRFHeaderName(): string {
  return CSRF_HEADER_NAME;
}
