import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMissedReplyEmail(
  to: string,
  botReply: string,
  personaName: string,
) {
  await transporter.sendMail({
    from: `"Axis" <${process.env.SMTP_FROM}>`,
    to,
    subject: `New reply from ${personaName}`,
    html: `
      <p>Kamu punya balasan baru dari <strong>${personaName}</strong> yang mungkin belum sempat kamu lihat:</p>
      <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; color: #555;">
        ${botReply}
      </blockquote>
      <p><a href="${process.env.FRONTEND_URL}/chat">Buka chat</a></p>
    `,
  });
}
