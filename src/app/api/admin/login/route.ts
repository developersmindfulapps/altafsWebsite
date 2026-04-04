import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Use our ultra-reliable Mongoose connection pool rather than a native one
    // This immediately resolves the 'querySrv ETIMEOUT' error!
    await connectDB();
    const db = mongoose.connection.useDb("AltafsDB");

    // Collection name EXACTLY matches "site_content"
    const data = await db.collection("site_content").findOne({});
    const admin = data?.admin;

    if (!admin) {
      console.log("[Auth] Admin document missing in site_content");
      return NextResponse.json({ error: "Admin not found" }, { status: 500 });
    }

    if (email !== admin.email) {
      console.log(`[Auth] Email mismatch: expected ${admin.email}, got ${email}`);
      return NextResponse.json({ error: "Invalid email" }, { status: 401 });
    }

    let isMatch = false;
    
    // Check if the database has a bcrypt hash (starts with $2) or plain text
    if (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$") || admin.password.startsWith("$2y$")) {
        isMatch = await bcrypt.compare(password, admin.password);
    } else {
        // Fallback for Plain-Text Passwords (like "TEMP_REPLACE_THIS")
        isMatch = (password === admin.password);
        if (isMatch) {
            console.log("[Auth] Note: Logged in using vulnerable plain-text password from DB. Consider hashing it!");
        }
    }

    if (!isMatch) {
      console.log("[Auth] Password mismatch");
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Success - generate response
    const response = NextResponse.json({ success: true });
    
    // Create cookie matching the local strategy to protect /admin
    const sessionToken = process.env.ADMIN_SESSION_TOKEN || 'secure_admin_logged_in_default_token';
    
    response.cookies.set({
      name: 'admin_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    console.log("[Auth] Admin login successful!");
    return response;

  } catch (error) {
    console.error("[Auth] Exception during login:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
