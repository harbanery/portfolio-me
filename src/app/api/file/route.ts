import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy delivery for Cloudinary-hosted files (ported from admin-portfolio).
 *
 * Cloudinary blocks PDF/ZIP delivery (401 "deny or ACL failure") when the
 * account setting "Allow delivery of PDF and ZIP files" is off. The admin
 * works around it by storing PDFs with a disguised .docx extension (the
 * file content stays a real PDF). This proxy fetches the asset
 * server-side and serves it to the browser with correct headers:
 * magic-byte detection re-labels disguised PDFs as `application/pdf`
 * with a proper .pdf filename, so the navbar download always yields a
 * PDF — never a bogus MS Word file.
 *
 * Query params:
 * - url (required): Cloudinary asset URL (res.cloudinary.com)
 * - download (optional): "1" to force download (Content-Disposition
 *   attachment) using the name from `name` or the URL path.
 */

const CLOUDINARY_HOST = "res.cloudinary.com";

/** Extract the filename from a URL for Content-Disposition. */
function filenameFromUrl(url: URL): string {
  const last = url.pathname.split("/").pop() ?? "file";
  // Strip the timestamp prefix added at upload time.
  const cleaned = last.replace(/^\d+-/, "");
  return cleaned || "file";
}

/** Sanitize a filename for the Content-Disposition header. */
function sanitizeFilename(name: string): string {
  const ascii = name.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
  return ascii.length > 0 ? ascii : "file";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");
  const forceDownload = searchParams.get("download") === "1";
  const nameParam = searchParams.get("name");

  if (!target) {
    return NextResponse.json(
      { success: false, error: "Missing url parameter" },
      { status: 400 },
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid url parameter" },
      { status: 400 },
    );
  }

  // Only allow this account's Cloudinary URLs (prevents SSRF to other hosts).
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (
    parsed.protocol !== "https:" ||
    parsed.hostname !== CLOUDINARY_HOST ||
    (cloudName && !parsed.pathname.includes(`/${cloudName}/`))
  ) {
    return NextResponse.json(
      { success: false, error: "Url is not allowed" },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(parsed.toString(), { cache: "no-store" });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch file" },
        { status: 502 },
      );
    }

    // Buffer the body to inspect magic bytes — needed to serve PDFs that
    // were stored with a disguised .docx extension as real PDFs.
    const buffer = Buffer.from(await upstream.arrayBuffer());

    // Detect PDF by the "%PDF-" magic bytes even when the extension is
    // disguised.
    const isPdf =
      buffer.length >= 5 &&
      buffer.subarray(0, 5).equals(Buffer.from("%PDF-", "ascii"));

    let filename = sanitizeFilename(nameParam ?? filenameFromUrl(parsed));
    let contentType = upstream.headers.get("content-type");

    if (isPdf) {
      if (!filename.toLowerCase().endsWith(".pdf")) {
        filename = `${filename.replace(/\.[^.]+$/, "")}.pdf`;
      }
      contentType = "application/pdf";
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType ?? "application/octet-stream");
    headers.set("Content-Length", String(buffer.length));
    headers.set("Cache-Control", "private, max-age=300");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set(
      "Content-Disposition",
      `${forceDownload ? "attachment" : "inline"}; filename="${filename}"`,
    );

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    console.error("Error proxying file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to proxy file" },
      { status: 502 },
    );
  }
}
