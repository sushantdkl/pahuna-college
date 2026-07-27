import nodemailer, { Transporter } from "nodemailer";
import {
  EMAIL_FROM_NAME,
  EMAIL_PASS,
  EMAIL_TEST_RECIPIENT,
  EMAIL_USER,
  PAHUNA_NOTIFICATION_EMAIL,
  SMTP_FROM,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
} from "../configs/constant";

type NotificationEmail = {
  subject: string;
  text: string;
  replyTo?: string;
};

type PasswordResetEmail = {
  to: string;
  fullName: string;
  resetUrl: string;
  expiresMinutes: number;
};

export class EmailNotificationService {
  private transporter?: Transporter;
  private gmailTransporter?: Transporter;

  private isConfigured() {
    return Boolean(
      SMTP_HOST &&
        SMTP_USER &&
        SMTP_PASS &&
        SMTP_FROM &&
        PAHUNA_NOTIFICATION_EMAIL,
    );
  }

  private getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
    }

    return this.transporter;
  }

  private isPasswordResetConfigured() {
    return Boolean(EMAIL_USER && EMAIL_PASS);
  }

  private getPasswordResetTransporter() {
    if (!this.gmailTransporter) {
      if (process.env.NODE_ENV === "test") {
        this.gmailTransporter = nodemailer.createTransport({
          jsonTransport: true,
        });
      } else {
        this.gmailTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
          },
        });
      }
    }

    return this.gmailTransporter;
  }

  async sendNotification(email: NotificationEmail) {
    if (!this.isConfigured()) {
      return { sent: false, reason: "SMTP is not configured" };
    }

    try {
      await this.getTransporter().sendMail({
        from: SMTP_FROM,
        to: PAHUNA_NOTIFICATION_EMAIL,
        replyTo: email.replyTo,
        subject: email.subject,
        text: email.text,
      });

      return { sent: true };
    } catch (error) {
      console.error(
        "Email notification failed:",
        error instanceof Error ? error.message : error,
      );
      return { sent: false, reason: "SMTP delivery failed" };
    }
  }

  async sendPasswordResetEmail(email: PasswordResetEmail) {
    if (!this.isPasswordResetConfigured() && process.env.NODE_ENV !== "test") {
      return { sent: false, reason: "Password reset email is not configured" };
    }

    const html = this.buildPasswordResetHtml(email);

    try {
      await this.getPasswordResetTransporter().sendMail({
        from: `${EMAIL_FROM_NAME} <${EMAIL_USER || "no-reply@pahuna.local"}>`,
        to: email.to,
        subject: "Reset your Pahuna password",
        html,
        text: [
          `Hello ${email.fullName},`,
          "Use this link to reset your Pahuna password:",
          email.resetUrl,
          `This link expires in ${email.expiresMinutes} minutes.`,
          "If you did not request this, you can ignore this message.",
        ].join("\n\n"),
      });

      return { sent: true };
    } catch (error) {
      console.error(
        "Password reset email failed:",
        error instanceof Error ? error.message : "SMTP delivery failed",
      );
      return { sent: false, reason: "Password reset email delivery failed" };
    }
  }

  async verifyPasswordResetTransporter() {
    if (!this.isPasswordResetConfigured()) {
      return { verified: false, reason: "Password reset email is not configured" };
    }

    await this.getPasswordResetTransporter().verify();
    return { verified: true };
  }

  async sendPasswordResetSmokeTest() {
    if (!EMAIL_TEST_RECIPIENT) {
      return { sent: false, reason: "EMAIL_TEST_RECIPIENT is not configured" };
    }

    return this.sendPasswordResetEmail({
      to: EMAIL_TEST_RECIPIENT,
      fullName: "Pahuna Tester",
      resetUrl: "http://localhost:3000/reset-password?token=smoke-test",
      expiresMinutes: 45,
    });
  }

  private buildPasswordResetHtml(email: PasswordResetEmail) {
    return `
      <div style="margin:0;padding:32px;background:#f8f3e8;font-family:Arial,sans-serif;color:#1c1917;">
        <div style="max-width:560px;margin:0 auto;background:#fffdf7;border:1px solid #d6f4df;border-radius:24px;padding:32px;">
          <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#047857;font-weight:700;">Pahuna</p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#064e3b;">Reset your password</h1>
          <p style="margin:0 0 18px;font-size:15px;line-height:1.7;">Hello ${this.escapeHtml(email.fullName)},</p>
          <p style="margin:0 0 22px;font-size:15px;line-height:1.7;">We received a request to reset your Pahuna account password. Use the button below to choose a new password.</p>
          <p style="margin:0 0 24px;">
            <a href="${email.resetUrl}" style="display:inline-block;background:#047857;color:#ffffff;text-decoration:none;border-radius:999px;padding:13px 22px;font-weight:700;">Reset Password</a>
          </p>
          <p style="margin:0 0 12px;font-size:13px;line-height:1.7;color:#57534e;">If the button does not work, paste this URL into your browser:</p>
          <p style="margin:0 0 18px;font-size:13px;line-height:1.6;word-break:break-all;color:#065f46;">${email.resetUrl}</p>
          <p style="margin:0 0 12px;font-size:13px;line-height:1.7;color:#57534e;">This link expires in ${email.expiresMinutes} minutes and can be used only once.</p>
          <p style="margin:0;font-size:13px;line-height:1.7;color:#57534e;">If you did not request this password reset, you can safely ignore this message.</p>
        </div>
      </div>
    `;
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

export const emailNotificationService = new EmailNotificationService();
