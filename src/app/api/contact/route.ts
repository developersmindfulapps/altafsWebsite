import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { sendEmail } from "@/lib/sendEmail";
import { escapeHtml } from "@/lib/htmlEscape";
import { isSameOriginOrUnknown } from "@/lib/requestOrigin";

const MAX = {
  name: 200,
  email: 254,
  practiceArea: 200,
  message: 8000,
} as const;

export async function POST(req: NextRequest) {
  if (!isSameOriginOrUnknown(req)) {
    return NextResponse.redirect(new URL("/contact?error=forbidden", req.url), {
      status: 303,
    });
  }

  try {
    await connectDB();

    const formData = await req.formData();

    const name = String(formData.get("name") ?? "").trim().slice(0, MAX.name);
    const email = String(formData.get("email") ?? "").trim().slice(0, MAX.email);
    const practiceArea = String(formData.get("practiceArea") ?? "")
      .trim()
      .slice(0, MAX.practiceArea);
    const message = String(formData.get("message") ?? "")
      .trim()
      .slice(0, MAX.message);

    if (!name || !email || !message) {
      return NextResponse.redirect(
        new URL("/contact?error=missing_fields", req.url),
        { status: 303 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.redirect(new URL("/contact?error=invalid_email", req.url), {
        status: 303,
      });
    }

    const data = { name, email, practiceArea, message };

    const newMessage = new ContactMessage(data);
    await newMessage.save();

    const lawyerEmail = process.env.GMAIL_USER || "admin@example.com";
    await sendEmail({
      to: lawyerEmail,
      subject: `New Contact Request: ${name.slice(0, 80)}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Practice Area:</strong> ${escapeHtml(practiceArea || "Not specified")}</p>
        <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\r?\n/g, "<br/>")}</p>
      `,
    }).catch((e) => console.error("Email sending failed:", e));

    return NextResponse.redirect(new URL("/contact?success=true", req.url), {
      status: 303,
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.redirect(new URL("/contact?error=server_error", req.url), {
      status: 303,
    });
  }
}
