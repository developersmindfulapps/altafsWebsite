import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { getAdminSessionSecret } from "@/lib/adminSession";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/requestOrigin";

const MAX_EMAIL_LEN = 254;
const MAX_PASSWORD_LEN = 256;

export async function POST(req: NextRequest) {
  const secret = getAdminSessionSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "Admin sign-in is not configured." },
      { status: 503 }
    );
  }

  const ip = getClientIp(req);

  const requestBudget = rateLimit(`admin-login-req:${ip}`, 120, 15 * 60 * 1000);
  if (!requestBudget.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(requestBudget.retryAfterSec) },
      }
    );
  }

  const authFailure = () => {
    const limited = rateLimit(`admin-login-fail:${ip}`, 20, 15 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many sign-in attempts. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        }
      );
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  };

  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password =
      typeof body.password === "string" ? body.password.slice(0, MAX_PASSWORD_LEN) : "";

    if (!email || !password || email.length > MAX_EMAIL_LEN) {
      return authFailure();
    }

    await connectDB();
    const db = mongoose.connection.useDb("AltafsDB");

    const data = await db.collection("site_content").findOne({});
    const admin = data?.admin;

    if (!admin || typeof admin.email !== "string" || typeof admin.password !== "string") {
      console.log("[Auth] Admin document missing or invalid in site_content");
      return authFailure();
    }

    if (email !== admin.email) {
      return authFailure();
    }

    let isMatch = false;
    const stored = admin.password;
    const isBcrypt =
      stored.startsWith("$2a$") ||
      stored.startsWith("$2b$") ||
      stored.startsWith("$2y$");

    if (isBcrypt) {
      isMatch = await bcrypt.compare(password, stored);
    } else if (process.env.NODE_ENV !== "production") {
      isMatch = password === stored;
      if (isMatch) {
        console.warn(
          "[Auth] Plain-text password accepted (development only). Hash the admin password for production."
        );
      }
    }

    if (!isMatch) {
      return authFailure();
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: "admin_session",
      value: secret,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("[Auth] Exception during login:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
