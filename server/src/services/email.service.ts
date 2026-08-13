import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config';

let transporter: Transporter | null = null;
let testAccount: nodemailer.TestAccount | null = null;

async function getTransporter(): Promise<Transporter> {
  if (transporter) return transporter;

  if (config.mailConfigured) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
    return transporter;
  }

  // Fallback to ethereal email for testing
  testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return transporter;
}

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendMailResult {
  sent: boolean;
  /** OTP is included ONLY when the SMTP mailer is not configured (dev fallback). */
  devOtp?: string;
}

/**
 * Sends an email. When no SMTP provider is configured the message is logged to
 * the server console instead (dev fallback) and the OTP is echoed back so the
 * flow can be exercised end-to-end locally.
 */
export async function sendMail(input: SendMailInput, devOtp?: string): Promise<SendMailResult> {
  const transport = await getTransporter();
  
  const info = await transport.sendMail({
    from: config.smtp.from || testAccount?.user || '"AI Resume Builder" <test@ethereal.email>',
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  if (testAccount) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('\n────────────────────────────────────────────');
    console.log(`[mail:dev] Ethereal email sent to ${input.to}!`);
    console.log(`[mail:dev] Preview URL: ${previewUrl}`);
    if (devOtp) console.log(`[mail:dev] OTP: ${devOtp}`);
    console.log('────────────────────────────────────────────\n');
    
    if (previewUrl) {
      try {
        const open = (await import('open')).default;
        await open(previewUrl);
      } catch (err) {
        // ignore if open fails
      }
    }
    
    return { sent: true, devOtp };
  }

  return { sent: true };
}

export function otpEmailHtml({ otp, purpose, minutes }: { otp: string; purpose: string; minutes: number }): string {
  const app = 'AI Resume Builder';
  const heading =
    purpose === 'password_reset' ? 'Reset your password' : 'Verify your email address';
  const body =
    purpose === 'password_reset'
      ? 'We received a request to reset your password. Use the code below to create a new one. If you did not request this, you can safely ignore this email.'
      : 'Thanks for signing up. Use the code below to activate your account and finish registration.';

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f5fb">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5fb;padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7f5">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#5b5ff6,#8b5cf6 50%,#d946ef)">
              <span style="color:#ffffff;font-size:20px;font-weight:bold">${app}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px">
              <h1 style="margin:0 0 8px;font-size:20px;color:#14162b">${heading}</h1>
              <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#4a4f6d">${body}</p>
              <p style="margin:0 0 8px;font-size:13px;color:#7a7f9c">Your one-time verification code</p>
              <div style="letter-spacing:8px;font-size:34px;font-weight:bold;color:#5b5ff6;background:#f4f5fb;border:1px dashed #d7daf0;border-radius:12px;text-align:center;padding:14px 8px">${otp}</div>
              <p style="margin:20px 0 0;font-size:12px;color:#7a7f9c;line-height:1.6">This code expires in ${minutes} minutes. For your security, never share it with anyone.</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
