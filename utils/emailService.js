// emailService.js
import nodemailer from "nodemailer";

export const sendReminderEmail = async (toEmail, name) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_MAIL,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    await transporter.verify();
    console.log("SMTP connection verified");

    const mailOptions = {
      from: `"Maharashtra Education Awards" <${process.env.ZOHO_MAIL}>`,
      to: toEmail,
      subject: "Acknowledgement of Interest – Mentorship Program",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #dcdcdc; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #0f1c33; font-size: 22px; margin-bottom: 16px;">Maharashtra Education Awards</h2>

      <p style="font-size: 16px; color: #333333;">Dear ${
        name || "Applicant"
      },</p>

      <p style="font-size: 16px; color: #333333;">
        Thank you for your interest in the <strong>Mentorship Program</strong> under the Maharashtra Education Awards initiative.
      </p>

      <p style="font-size: 16px; color: #333333;">
        We are currently in the process of evaluating all applications. Kindly note that only shortlisted candidates will receive a follow-up email with further details and a formal reminder regarding the next steps of the mentorship engagement.
      </p>

      <p style="font-size: 16px; color: #333333;">
        We truly appreciate your enthusiasm and your willingness to contribute to this impactful initiative. Should your profile be shortlisted, you will be contacted in due course with the necessary instructions.
      </p>

      <p style="font-size: 16px; color: #333333; margin-top: 24px;">
        Sincerely,<br/>
        <strong>Maharashtra Education Awards Team</strong>
      </p>
    </div>
  `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error("Email error:", error.message);
    throw error;
  }
};
