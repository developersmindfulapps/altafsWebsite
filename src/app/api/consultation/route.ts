import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ConsultationRequest from "@/models/ConsultationRequest";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const formData = await req.formData();
    
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      caseType: formData.get("caseType") as string,
      date: formData.get("date") as string,
      timeSlot: formData.get("timeSlot") as string,
      message: formData.get("message") as string,
    };

    if (!data.name || !data.email || !data.phone || !data.caseType) {
      return NextResponse.redirect(new URL("/book-consultation?error=missing_fields", req.url), { status: 303 });
    }

    const newRequest = new ConsultationRequest(data);
    await newRequest.save();

    const lawyerEmail = process.env.GMAIL_USER || 'admin@example.com';
    await sendEmail({
      to: lawyerEmail,
      subject: `New Consultation Form: ${data.name}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Case Type:</strong> ${data.caseType}</p>
        <p><strong>Preferred Date:</strong> ${data.date || 'Flexible'}</p>
        <p><strong>Preferred Time Slot:</strong> ${data.timeSlot || 'Flexible'}</p>
        <p><strong>Message:</strong><br/>${data.message || 'None provided.'}</p>
      `,
    }).catch((e) => console.error("Email sending failed:", e));

    return NextResponse.redirect(new URL("/book-consultation?success=true", req.url), { status: 303 });
  } catch (error) {
    console.error("Error saving consultation request:", error);
    return NextResponse.redirect(new URL("/book-consultation?error=server_error", req.url), { status: 303 });
  }
}
