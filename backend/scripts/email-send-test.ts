import dotenv from "dotenv";
import { emailNotificationService } from "../src/services/email-notification.service";

dotenv.config();

async function main() {
  const result = await emailNotificationService.sendPasswordResetSmokeTest();

  if (!result.sent) {
    throw new Error(result.reason || "SMTP test email failed");
  }

  console.log("SMTP test email accepted");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "SMTP test email failed");
  process.exit(1);
});
