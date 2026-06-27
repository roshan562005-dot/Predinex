import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<{ success: boolean; error?: string }> {
  // DEV MODE: If SMTP is not configured, print to console
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 DEV MODE – Password Reset Link:');
    console.log(resetUrl);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return { success: true };
  }

  try {
    await transporter.sendMail({
      from: `"Prednix Platform" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Reset your Prednix password',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #050505; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 48px;">
            <h1 style="margin:0; font-size:28px; font-weight:900; letter-spacing:-1px;">Prednix</h1>
            <p style="margin:8px 0 0; opacity:0.9; font-weight:600;">Digital Metabolic Platform</p>
          </div>
          <div style="padding: 48px;">
            <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 800;">Reset your password</h2>
            <p style="color: #9ca3af; line-height: 1.6; margin: 0 0 32px;">
              We received a request to reset your password. Click the button below to create a new one. This link expires in <strong style="color:#fff">1 hour</strong>.
            </p>
            <a href="${resetUrl}" style="display:inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #fff; text-decoration: none; padding: 16px 32px; border-radius: 14px; font-weight: 800; font-size: 15px; letter-spacing: 0.5px;">
              Reset Password →
            </a>
            <p style="color: #6b7280; font-size: 13px; margin: 32px 0 0;">
              If you didn't request this, you can safely ignore this email. Your password will not change.
            </p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (err: any) {
    console.error('Email send error:', err);
    return { success: false, error: err.message };
  }
}

export async function sendReminderEmail(
  to: string,
  firstName: string
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[MOCK EMAIL to ${to}]: Hey ${firstName}, log your vitals!`);
    return { success: true };
  }

  try {
    await transporter.sendMail({
      from: `"Predinex Clinical" <${process.env.SMTP_USER}>`,
      to,
      subject: "Predinex: Time to log your daily vitals!",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #050505; color: #fff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px 40px;">
            <h1 style="margin:0; font-size:24px; font-weight:900; letter-spacing:-1px;">Predinex</h1>
            <p style="margin:5px 0 0; opacity:0.9; font-weight:600;">Daily Health Reminder</p>
          </div>
          <div style="padding: 40px;">
            <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 800;">Hi ${firstName} 👋,</h2>
            <p style="color: #9ca3af; line-height: 1.6; margin: 0 0 32px;">
              Just a quick friendly reminder from your Predinex dashboard. You haven't logged your vitals (like blood sugar or blood pressure) yet today!
              <br><br>
              Consistent tracking is the #1 scientifically proven way to achieve metabolic remission. 
            </p>
            <a href="https://predinex.com/progress" style="display:inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 800; font-size: 15px;">
              Log My Vitals Now →
            </a>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (err: any) {
    console.error('Email send error:', err);
    return { success: false, error: err.message };
  }
}
