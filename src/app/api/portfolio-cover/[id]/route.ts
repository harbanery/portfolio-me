import { NextResponse } from "next/server";
import prisma from "@/server/db";

/**
 * Cover image delivery for showcase projects.
 *
 * Some covers are stored in the database as inline base64 data URIs
 * (pasted into the admin instead of uploaded). Embedding those in the
 * page would ship megabytes of base64 inside the HTML/RSC payload — the
 * single biggest drag on the home page's performance. This route serves
 * them as ordinary cacheable image responses instead, so the document
 * only carries a short URL.
 *
 * - `GET /api/portfolio-cover/<projectId>?v=<updatedAt ms>` → the
 *   decoded image bytes (immutable cache; the `v` buster changes when
 *   the admin updates the record).
 * - Remote http(s) covers (Cloudinary) never hit this route — the
 *   service passes their URL straight through.
 */

export const dynamic = "force-dynamic";

/** Parse "data:<mime>;base64,<payload>" into its parts. */
function parseDataUri(
  value: string,
): { mime: string; bytes: Buffer } | null {
  const match = /^data:([^;,]+)?(;base64)?,([\s\S]*)$/.exec(value);
  if (!match) return null;
  const mime = match[1] || "image/png";
  const payload = match[3];
  try {
    return { mime, bytes: Buffer.from(payload, "base64") };
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json(
      { success: false, error: "Invalid project id" },
      { status: 400 },
    );
  }

  try {
    const row = await prisma.portfolio.findFirst({
      where: { id: projectId, status: "ACTIVE" },
      select: { image: true, updatedAt: true },
    });

    if (!row?.image) {
      return NextResponse.json(
        { success: false, error: "Cover not found" },
        { status: 404 },
      );
    }

    // Remote covers are linked directly; only inline data is served here.
    if (!row.image.startsWith("data:")) {
      return NextResponse.redirect(row.image, 302);
    }

    const parsed = parseDataUri(row.image);
    if (!parsed || parsed.bytes.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid cover data" },
        { status: 422 },
      );
    }

    const version = row.updatedAt.getTime();
    return new NextResponse(new Uint8Array(parsed.bytes), {
      status: 200,
      headers: {
        "Content-Type": parsed.mime,
        "Content-Length": String(parsed.bytes.length),
        // The URL carries a version buster, so the bytes are immutable.
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: `"cover-${projectId}-${version}"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error serving portfolio cover:", error);
    return NextResponse.json(
      { success: false, error: "Failed to serve cover" },
      { status: 500 },
    );
  }
}
