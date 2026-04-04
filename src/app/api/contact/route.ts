import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const formData = await req.formData();
    
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      practiceArea: formData.get("practiceArea") as string,
      message: formData.get("message") as string,
    };

    if (!data.name || !data.email || !data.message) {
      return NextResponse.redirect(new URL("/contact?error=missing_fields", req.url));
    }

    const newMessage = new ContactMessage(data);
    await newMessage.save();

    const lawyerEmail = process.env.GMAIL_USER || 'admin@example.com';
    await sendEmail({
      to: lawyerEmail,
      subject: `New Contact Request: ${data.name}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Practice Area:</strong> ${data.practiceArea || 'Not specified'}</p>
        <p><strong>Message:</strong><br/>${data.message}</p>
      `,
    }).catch((e) => console.error("Email sending failed:", e));

    return NextResponse.redirect(new URL("/contact?success=true", req.url), { status: 303 });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.redirect(new URL("/contact?error=server_error", req.url), { status: 303 });
  }
}
