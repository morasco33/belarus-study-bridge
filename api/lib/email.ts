import nodemailer from "nodemailer";

const NOTIFY_EMAIL = "Morasco33@gmail.com";

// Create a reusable transporter
// Using Gmail SMTP with app password, or fallback to a generic SMTP config
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER || "";
  const smtpPass = process.env.SMTP_PASS || "";

  if (!smtpUser || !smtpPass) {
    console.warn(
      "[Email] SMTP_USER and SMTP_PASS not configured. Email notifications will be logged but not sent."
    );
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  country: string;
  program: string;
  educationLevel: string;
  message?: string;
}

export async function sendApplicationNotificationEmail(
  data: ApplicationData
): Promise<boolean> {
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Minsk",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1E3A8A, #172554); padding: 25px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #F59E0B; margin: 0; font-size: 24px;">🎓 Belarus Study Bridge</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">New Application Received</p>
      </div>
      
      <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 25px; border-radius: 0 0 12px 12px;">
        <h2 style="color: #1E3A8A; font-size: 18px; margin-top: 0;">📋 Applicant Details</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; font-weight: bold; color: #374151; width: 140px;">Name:</td>
            <td style="padding: 10px 0; color: #6b7280;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Email:</td>
            <td style="padding: 10px 0; color: #6b7280;"><a href="mailto:${data.email}" style="color: #1E3A8A;">${data.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">WhatsApp:</td>
            <td style="padding: 10px 0; color: #6b7280;"><a href="https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}" style="color: #16a34a;">${data.whatsapp}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Country:</td>
            <td style="padding: 10px 0; color: #6b7280;">${data.country}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Program Interest:</td>
            <td style="padding: 10px 0; color: #6b7280;">${data.program}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Education Level:</td>
            <td style="padding: 10px 0; color: #6b7280;">${data.educationLevel}</td>
          </tr>
          ${data.message ? `
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Message:</td>
            <td style="padding: 10px 0; color: #6b7280;">${data.message}</td>
          </tr>
          ` : ""}
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Submitted:</td>
            <td style="padding: 10px 0; color: #6b7280;">${timestamp}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #1E3A8A;">
          <p style="margin: 0; color: #1e40af; font-size: 13px;">
            💡 <strong>Action Required:</strong> Please review and respond to this application within 24 hours.
            You can manage all applications from the <strong>Admin Dashboard</strong>.
          </p>
        </div>
      </div>
      
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 15px;">
        This is an automated notification from Belarus Study Bridge
      </p>
    </div>
  `;

  const textContent = `
New Application - Belarus Study Bridge

Applicant: ${data.firstName} ${data.lastName}
Email: ${data.email}
WhatsApp: ${data.whatsapp}
Country: ${data.country}
Program Interest: ${data.program}
Education Level: ${data.educationLevel}
${data.message ? `Message: ${data.message}` : ""}
Submitted: ${timestamp}

Please review and respond within 24 hours.
  `.trim();

  // Always log the application details
  console.log("[Email] New application notification:");
  console.log(textContent);

  const transporter = createTransporter();
  if (!transporter) {
    console.log(
      "[Email] Transporter not configured - notification logged above but not emailed."
    );
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Belarus Study Bridge" <${process.env.SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `📋 New Application: ${data.firstName} ${data.lastName} - ${data.program}`,
      text: textContent,
      html: htmlContent,
    });
    console.log(`[Email] Notification sent successfully to ${NOTIFY_EMAIL}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send notification:", error);
    return false;
  }
}
