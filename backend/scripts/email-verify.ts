import dotenv from "dotenv";
import { emailNotificationService } from "../src/services/email-notification.service";

dotenv.config();

async function main() {
  const result = await emailNotificationService.verifyPasswordResetTransporter();

  if (!result.verified) {
    throw new Error(result.reason || "SMTP verification failed");
  }

  console.log("SMTP verification succeeded");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "SMTP verification failed");
  process.exit(1);
});
