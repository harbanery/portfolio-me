import { prisma } from "../config/database";

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts?: number;
  blockedUntil?: Date;
}

export async function checkRateLimit(ipAddress: string): Promise<RateLimitResult> {
  let loginAttempt = await prisma.loginAttempt.findUnique({
    where: { ipAddress },
  });

  const now = new Date();

  // Reset if block expired
  if (
    loginAttempt &&
    loginAttempt.blockedUntil &&
    loginAttempt.blockedUntil <= now
  ) {
    await prisma.loginAttempt.update({
      where: { ipAddress },
      data: {
        attemptCount: 0,
        blockedUntil: null,
      },
    });
    loginAttempt.attemptCount = 0;
    loginAttempt.blockedUntil = null;
  }

  // Check if blocked
  if (loginAttempt?.blockedUntil && loginAttempt.blockedUntil > now) {
    return {
      allowed: false,
      blockedUntil: loginAttempt.blockedUntil,
    };
  }

  if (!loginAttempt) {
    // Create new login attempt record
    await prisma.loginAttempt.create({
      data: {
        ipAddress,
        attemptCount: 1,
        lastAttemptAt: now,
      },
    });

    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - 1,
    };
  }

  // Check if max attempts reached
  if (loginAttempt.attemptCount >= MAX_ATTEMPTS) {
    // Block the IP
    const blockedUntil = new Date(now.getTime() + BLOCK_DURATION);
    await prisma.loginAttempt.update({
      where: { ipAddress },
      data: {
        blockedUntil,
        lastAttemptAt: now,
      },
    });

    return {
      allowed: false,
      blockedUntil,
    };
  }

  // Update attempt count
  const newCount = loginAttempt.attemptCount + 1;
  await prisma.loginAttempt.update({
    where: { ipAddress },
    data: {
      attemptCount: newCount,
      lastAttemptAt: now,
    },
  });

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - newCount,
  };
}

export async function resetRateLimit(ipAddress: string): Promise<void> {
  await prisma.loginAttempt.update({
    where: { ipAddress },
    data: {
      attemptCount: 0,
      blockedUntil: null,
    },
  }).catch(() => {
    // Record might not exist
  });
}

export async function recordSuccessfulLogin(ipAddress: string): Promise<void> {
  await prisma.loginAttempt.delete({
    where: { ipAddress },
  }).catch(() => {
    // Record might not exist
  });
}
