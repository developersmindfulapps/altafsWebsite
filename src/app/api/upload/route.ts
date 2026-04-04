import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    const type: string = (data.get("type") as string) || "profile";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Apply strict sizing logic limits as requested by user
    const sizeInMB = buffer.length / (1024 * 1024);
    
    if (type === "hero" && sizeInMB > 10) {
      return NextResponse.json({ success: false, error: "Hero image must be less than 10MB" }, { status: 400 });
    } else if (type === "profile" && sizeInMB > 3) {
      return NextResponse.json({ success: false, error: "Profile image must be less than 3MB" }, { status: 400 });
    }

    // Generate unique filename via timestamp
    const ext = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    // Write file binary
    await writeFile(filepath, buffer);

    // Return the publicly accessible URL chunk
    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Server upload failed" }, { status: 500 });
  }
}
