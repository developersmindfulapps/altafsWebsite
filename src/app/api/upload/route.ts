import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    const type: string = (data.get("type") as string) || "profile";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
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
    } else if (type === "profile" && sizeInMB > 5) {
      return NextResponse.json(
        { success: false, error: "Profile image must be less than 5MB" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Only image files are allowed" },
        { status: 400 }
      );
    }


    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder:
        type === "hero"
          ? "law-firm/hero"
          : "law-firm/profile",
      resource_type: "image",
    });


    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Server upload failed" },
      { status: 500 }
    );
  }
}