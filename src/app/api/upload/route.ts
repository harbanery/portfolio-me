import { NextRequest, NextResponse } from "next/server";

function generateUploadSignature(params: any, apiSecret: string): string {
  const crypto = require("node:crypto");
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto
    .createHash("sha1")
    .update(sortedParams + apiSecret)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = (data.get("file") ||
      data.get("images")) as unknown as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename and folder structure
    const timestamp = Date.now();
    const folder = "portfolio";
    const filename = `${timestamp}-${file.name}`;

    // Prepare signed upload parameters
    const uploadTimestamp = Math.floor(Date.now() / 1000);
    const params = {
      timestamp: uploadTimestamp,
      public_id: filename,
      folder: folder,
    };

    // Generate signature
    const signature = generateUploadSignature(
      params,
      process.env.CLOUDINARY_API_SECRET || "",
    );

    // Upload to Cloudinary using signed upload
    const formData = new FormData();
    formData.append("file", new Blob([buffer], { type: file.type }), filename);
    formData.append("api_key", process.env.CLOUDINARY_API_KEY || "");
    formData.append("timestamp", uploadTimestamp.toString());
    formData.append("public_id", filename);
    formData.append("folder", folder);
    formData.append("signature", signature);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!cloudinaryResponse.ok) {
      const errorData = await cloudinaryResponse.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }

    const cloudinaryData = await cloudinaryResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        url: cloudinaryData.secure_url,
        storagePath: cloudinaryData.public_id,
        mimeType: file.type,
        size: file.size,
        name: file.name,
        width: cloudinaryData.width,
        height: cloudinaryData.height,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error: `Failed to upload file: ${error?.message || "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("path");

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "Missing public ID" },
        { status: 400 },
      );
    }

    // Prepare signed delete parameters
    const deleteTimestamp = Math.floor(Date.now() / 1000);
    const params = {
      timestamp: deleteTimestamp,
      public_id: publicId,
    };

    // Generate signature for delete
    const signature = generateUploadSignature(
      params,
      process.env.CLOUDINARY_API_SECRET || "",
    );

    // Delete from Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: publicId,
          api_key: process.env.CLOUDINARY_API_KEY,
          timestamp: deleteTimestamp,
          signature: signature,
        }),
      },
    );

    if (!cloudinaryResponse.ok) {
      const errorData = await cloudinaryResponse.json();
      throw new Error(errorData.error?.message || "Cloudinary delete failed");
    }

    const result = await cloudinaryResponse.json();

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${publicId}`,
      result: result,
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to delete file: ${error?.message || "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
