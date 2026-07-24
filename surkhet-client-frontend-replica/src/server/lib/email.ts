type Mail = Record<string, any>;

export async function sendEmails(..._messages: Mail[]) {
  return { success: true };
}

export async function sendEmail(_message: Mail) {
  return { success: true };
}

const build = (subject: string): Mail => ({ subject, text: subject });

export const buildContactConfirmationEmail = (_data?: Mail) => build("Thanks for contacting Pahuna");
export const buildInquiryConfirmationEmail = (_data?: Mail) => build("Your Pahuna inquiry was received");
export const buildInquiryInternalEmail = (_data?: Mail) => build("New Pahuna inquiry");
export const buildHotelLeadConfirmationEmail = (_data?: Mail) => build("Your stay request was received");
export const buildHotelLeadInternalEmail = (_data?: Mail) => build("New stay request");
export const buildConsultingConfirmationEmail = (_data?: Mail) => build("Your consulting request was received");
export const buildPartnerConfirmationEmail = (_data?: Mail) => build("Your partner application was received");
export const buildPartnerInternalEmail = (_data?: Mail) => build("New partner application");
export const buildTrainingConfirmationEmail = (_data?: Mail) => build("Your training enrollment was received");
export const buildTrainingInternalEmail = (_data?: Mail) => build("New training enrollment");
export const buildCallbackConfirmationEmail = (_data?: Mail) => build("Your callback request was received");
export const buildCallbackInternalEmail = (_data?: Mail) => build("New callback request");
export const buildAdminNotificationEmail = (_data?: Mail) => build("New Pahuna notification");
