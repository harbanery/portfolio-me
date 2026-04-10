import { NextRequest, NextResponse } from "next/server";
const { supabase } = require("@/lib/config/storage");

interface SupabaseUploadResult {
  path: string;
  fullPath: string;
  publicUrl: string;
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

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Upload to Supabase
    const { data: dataStorage, error } = await supabase.storage
      .from("portfolio-images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(dataStorage.path);

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        storagePath: dataStorage.path,
        mimeType: file.type,
        size: file.size,
        name: file.name,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);

    // Handle specific Supabase errors
    if (error?.statusCode === "403" || error?.status === 403) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Storage permission denied. Please check Supabase RLS policies and ensure SUPABASE_SERVICE_ROLE_KEY is set correctly.",
        },
        { status: 403 },
      );
    }

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
    const storagePath = searchParams.get("path");
    const publicUrl = searchParams.get("url");

    if (!storagePath || !publicUrl) {
      return NextResponse.json(
        { success: false, error: "Missing storage path or URL" },
        { status: 400 },
      );
    }

    // Delete from Supabase storage
    const { error } = await supabase.storage
      .from("portfolio-images")
      .remove([storagePath]);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete file from storage" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${storagePath}`,
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
