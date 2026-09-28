const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (not regular password)
    },
  });
};

/**
 * Send password reset email with a branded HTML template
 */
const sendPasswordResetEmail = async (toEmail, userName, resetUrl) => {
  const transporter = createTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>Reset Your Password — DocMindAI</title>
    </head>
    <body style="margin:0;padding:0;background:#06060a;font-family:Inter,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#06060a;padding:40px 20px;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

            <!-- Logo -->
            <tr><td align="center" style="padding-bottom:32px;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#4f46e5);display:inline-block;vertical-align:middle;"></div>
                <span style="font-size:22px;font-weight:800;color:white;vertical-align:middle;">DocMind<span style="color:#a78bfa;">AI</span></span>
              </div>
            </td></tr>

            <!-- Card -->
            <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(139,92,246,0.2);border-radius:20px;padding:40px 36px;">
              <h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:white;letter-spacing:-0.5px;">Reset Your Password 🔐</h1>
              <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.6;">
                Hey <strong style="color:white;">${userName}</strong>, we received a request to reset your DocMindAI password.
                Click the button below to choose a new one.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${resetUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:white;text-decoration:none;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.2px;box-shadow:0 6px 24px rgba(109,40,217,0.4);">
                  Reset My Password →
                </a>
              </div>

              <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.35);line-height:1.6;">
                This link expires in <strong style="color:#a78bfa;">15 minutes</strong>. If you didn't request this, you can safely ignore this email — your password won't change.
              </p>

              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:28px 0;"/>

              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);word-break:break-all;">
                Or copy this link: <span style="color:#a78bfa;">${resetUrl}</span>
              </p>
            </td></tr>

            <!-- Footer -->
            <tr><td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);">
                © 2026 DocMindAI by Vikash · All rights reserved
              </p>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"DocMindAI" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔐 Reset your DocMindAI password',
    html,
  });
};

module.exports = { sendPasswordResetEmail };
