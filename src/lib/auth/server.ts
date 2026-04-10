import { cookies } from "next/headers";
import { prisma } from "../config/database";

export async function verifyServerSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (!sessionId) {
    return false;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return false;
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      // Clean up expired session
      await prisma.session.delete({
        where: { id: sessionId },
      }).catch(() => {});
      return false;
    }

    // Check idle timeout (30 minutes)
    const idleTime = (Date.now() - session.updatedAt.getTime()) / 1000;
    const IDLE_TIMEOUT = 30 * 60; // 30 minutes

    if (idleTime > IDLE_TIMEOUT) {
      await prisma.session.delete({
        where: { id: sessionId },
      }).catch(() => {});
      return false;
    }

    // Update last activity
    await prisma.session.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return true;
  } catch (error) {
    console.error("Session verification error:", error);
    return false;
  }
}

export async function getServerSession(): Promise<{
  userId: number;
  sessionId: string;
} | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return null;
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({
        where: { id: sessionId },
      }).catch(() => {});
      return null;
    }

    // Check idle timeout
    const idleTime = (Date.now() - session.updatedAt.getTime()) / 1000;
    const IDLE_TIMEOUT = 30 * 60; // 30 minutes

    if (idleTime > IDLE_TIMEOUT) {
      await prisma.session.delete({
        where: { id: sessionId },
      }).catch(() => {});
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
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}
