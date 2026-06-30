import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RECIPIENT = process.env.CONTACT_RECIPIENT_EMAIL ?? "6464ssq@gmail.com";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // If SMTP is configured, use nodemailer to send the email.
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 0);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && port && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: { user, pass },
      });

      const html = `
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject ?? "Contact Form"}</p>
        <p><strong>Message:</strong></p>
        <div>${message.replace(/\n/g, "<br/>")}</div>
      `;

      await transporter.sendMail({
        from: `${name} <${email}>`,
        to: RECIPIENT,
        subject: subject ?? "New contact form submission",
        html,
      });

      return NextResponse.json({ ok: true });
    }

    // If SMTP not configured, log and return 501 so developer knows to set env vars.
    console.warn("SMTP not configured — contact submissions will not be emailed.");
    console.log("Contact submission:", { name, email, subject, message });
    return NextResponse.json(
      {
        ok: false,
        note: "SMTP not configured. Configure SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS.",
      },
      { status: 501 }
    );
  } catch (err) {
    console.error("Contact API error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
