/**
 * @deprecated Import from "@/lib/mail/resend" instead.
 * Kept as a compatibility re-export so older dynamic imports keep working.
 */
export {
  type MailMessage,
  isMailConfigured,
  smtpConfigured,
  sendMail,
  trySendMail,
} from "./resend";
