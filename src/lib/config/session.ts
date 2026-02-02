import { cookies } from "next/headers";
import { prisma } from "./database";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 2; // 2 hours in seconds
const SESSION_IDLE_TIMEOUT = 60 * 30; // 30 minutes in seconds

export interface SessionData {
  userId: number;
  sessionId: string;
  expiresAt: Date;
  lastActivity: Date;
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
  const lastActivity = new Date();

  // Store session in database
  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    },
  });

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/admin",
  });

  return sessionId;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  // Check session in database
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return null;
  }

  // Check if session expired
  if (new Date() > session.expiresAt) {
    await deleteSession(sessionId);
    return null;
  }

  // Check idle timeout (implement via lastActivity in separate table or extend Session model)
  // For now, we'll use the updatedAt timestamp for idle checking
  const idleTime = (Date.now() - session.updatedAt.getTime()) / 1000;
  if (idleTime > SESSION_IDLE_TIMEOUT) {
    await deleteSession(sessionId);
    return null;
  }

  // Update last activity
  await prisma.session.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });

  return {
    userId: session.userId,
    sessionId: session.id,
    expiresAt: session.expiresAt,
    lastActivity: session.updatedAt,
  };
}

export async function deleteSession(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  await prisma.session.delete({
    where: { id: sessionId },
  }).catch(() => {
    // Session might not exist anymore
  });
}

export async function deleteAllSessions(userId: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  await prisma.session.deleteMany({
    where: { userId },
  });
}

export async function verifySession(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export async function refreshSession(): Promise<void> {
  const session = await getSession();
  if (session) {
    await prisma.session.update({
      where: { id: session.sessionId },
      data: {
        updatedAt: new Date(),
      },
    });
  }
}
