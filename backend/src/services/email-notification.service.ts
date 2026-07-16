import nodemailer, { Transporter } from "nodemailer";
import {
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

export class EmailNotificationService {
  private transporter?: Transporter;

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
}

export const emailNotificationService = new EmailNotificationService();
