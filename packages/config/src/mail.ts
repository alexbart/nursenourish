export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export const mailConfig = (): MailConfig => ({
  host: process.env.MAIL_HOST || "smtp.mailtrap.io",
  port: Number(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_SECURE === "true",
  auth: {
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASS || "",
  },
  from: process.env.MAIL_FROM || "noreply@nursenourish.com",
});