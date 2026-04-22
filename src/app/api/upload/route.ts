import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { isAdminSessionValid } from "@/lib/adminAuth";

function ensureCloudinaryConfigured() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (
    !CLOUDINARY_CLOUD_NAME ||
    !CLOUDINARY_API_KEY ||
    !CLOUDINARY_API_SECRET
  ) {
    return false;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  return true;
}

function uploadBuffer(
  buffer: Buffer,
  folder: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result?.public_id) {
          reject(new Error("Cloudinary upload returned no public_id"));
          return;
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}


export async function POST(req: NextRequest) {
  if (!isAdminSessionValid(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!ensureCloudinaryConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "Image upload is not configured (Cloudinary env vars missing).",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "profile";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, WEBP allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sizeInMB = buffer.length / (1024 * 1024);

    if (type === "hero" && sizeInMB > 10) {
      return NextResponse.json(
        { success: false, error: "Hero image must be less than 10MB" },
        { status: 400 }
      );
    }

    if (type === "profile" && sizeInMB > 5) {
      return NextResponse.json(
        { success: false, error: "Profile image must be less than 5MB" },
        { status: 400 }
      );
    }

    const folder =
      type === "hero" ? "law-firm/hero" : "law-firm/profile";

    const result = await uploadBuffer(buffer, folder);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Server upload failed",
      },
      { status: 500 }
    );
  }
}
