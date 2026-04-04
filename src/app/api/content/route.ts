import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import { getWebsiteContent } from "@/lib/getContent";
import { revalidateTag } from "next/cache"; // ✅ IMPORTANT

export async function GET() {
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
  try {
    await connectDB();

    const body = await req.json();

    const updatedContent = await SiteContent.findOneAndUpdate(
      {},
      { ...body, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    // ✅ THIS is the real fix
    revalidateTag("content");

    return NextResponse.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error("Error updating site_content:", error);
    return NextResponse.json(
      { success: false, message: "Error updating content" },
      { status: 500 }
    );
  }
}