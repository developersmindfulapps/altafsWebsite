import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import { getWebsiteContent } from "@/lib/getContent";
import { revalidateTag } from "next/cache";
import { isAdminSessionValid } from "@/lib/adminAuth";
import { sanitizeContentBody } from "@/lib/sanitizeContentBody";

export async function GET(req: NextRequest) {
  if (!isAdminSessionValid(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const content = await getWebsiteContent();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Error fetching site_content:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdminSessionValid(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const body = await req.json();
    const safe = sanitizeContentBody(body);

    const updatedContent = await SiteContent.findOneAndUpdate(
      {},
      { ...safe, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    revalidateTag("content", "max");

    return NextResponse.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error("Error updating site_content:", error);
    return NextResponse.json(
      { success: false, message: "Error updating content" },
      { status: 500 }
    );
  }
}
