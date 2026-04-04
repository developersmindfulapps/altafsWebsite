import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import { getWebsiteContent } from "@/lib/getContent";

export async function GET() {
  try {
    await connectDB();
    const content = await getWebsiteContent();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Error fetching site_content:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();

    // 1. Get ONLY the current singular document (or create if not existing)
    // 2. We use findOneAndUpdate to cleanly upsert the nested JSON tree
    const updatedContent = await SiteContent.findOneAndUpdate(
      {},
      { ...body, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    // 3. Directly Revalidate Next.js cache by path to nuke the entire app cache natively
    const { revalidatePath } = require("next/cache");
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error("Error updating site_content:", error);
    return NextResponse.json({ success: false, message: "Error updating content" }, { status: 500 });
  }
}
