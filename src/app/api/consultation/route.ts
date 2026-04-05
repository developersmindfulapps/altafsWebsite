import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ConsultationRequest from "@/models/ConsultationRequest";
import { sendEmail } from "@/lib/sendEmail";
import { escapeHtml } from "@/lib/htmlEscape";
import { isSameOriginOrUnknown } from "@/lib/requestOrigin";

const MAX = {
  name: 200,
  email: 254,
  phone: 40,
  caseType: 200,
  date: 80,
  timeSlot: 80,
  message: 8000,
} as const;

export async function POST(req: NextRequest) {
  if (!isSameOriginOrUnknown(req)) {
    return NextResponse.redirect(
      new URL("/book-consultation?error=forbidden", req.url),
      { status: 303 }
    );
  }

  try {
    await connectDB();

    const formData = await req.formData();

    const name = String(formData.get("name") ?? "").trim().slice(0, MAX.name);
    const email = String(formData.get("email") ?? "").trim().slice(0, MAX.email);
    const phone = String(formData.get("phone") ?? "").trim().slice(0, MAX.phone);
    const caseType = String(formData.get("caseType") ?? "")
      .trim()
      .slice(0, MAX.caseType);
    const date = String(formData.get("date") ?? "").trim().slice(0, MAX.date);
    const timeSlot = String(formData.get("timeSlot") ?? "")
      .trim()
      .slice(0, MAX.timeSlot);
    const message = String(formData.get("message") ?? "")
      .trim()
      .slice(0, MAX.message);

    if (!name || !email || !phone || !caseType) {
      return NextResponse.redirect(
        new URL("/book-consultation?error=missing_fields", req.url),
        { status: 303 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.redirect(
        new URL("/book-consultation?error=invalid_email", req.url),
        { status: 303 }
      );
    }

    const data = { name, email, phone, caseType, date, timeSlot, message };

    const newRequest = new ConsultationRequest(data);
    await newRequest.save();

    const lawyerEmail = process.env.GMAIL_USER || "admin@example.com";
    await sendEmail({
      to: lawyerEmail,
      subject: `New Consultation Form: ${name.slice(0, 80)}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Case Type:</strong> ${escapeHtml(caseType)}</p>
        <p><strong>Preferred Date:</strong> ${escapeHtml(date || "Flexible")}</p>
        <p><strong>Preferred Time Slot:</strong> ${escapeHtml(timeSlot || "Flexible")}</p>
        <p><strong>Message:</strong><br/>${escapeHtml(message || "None provided.").replace(/\r?\n/g, "<br/>")}</p>
      `,
    }).catch((e) => console.error("Email sending failed:", e));

    return NextResponse.redirect(
      new URL("/book-consultation?success=true", req.url),
      { status: 303 }
    );
  } catch (error) {
    console.error("Error saving consultation request:", error);
    return NextResponse.redirect(
      new URL("/book-consultation?error=server_error", req.url),
      { status: 303 }
    );
  }
}
