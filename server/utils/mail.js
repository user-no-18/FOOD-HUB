import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Use App Password if 2FA is on
  },
});

// Function to send OTP
export const sendOTPMail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Foodhub Services" <${process.env.EMAIL}>`, // sender info
      to: email, // receiver
      subject: "Your One-Time Password (OTP) for Foodhub", // professional subject
      text: `Hello,

Your one-time password (OTP) for Foodhub is: ${otp}

Please use this OTP within 5 minutes. Do not share it with anyone.

Thank you,
The Foodhub Team`, // plain text fallback
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #FF5722;">Foodhub Services</h2>
        <p>Hello,</p>
        <p>Your one-time password (OTP) is:</p>
        <h3 style="color: #007BFF;">${otp}</h3>
        <p>Please use this OTP within <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p>Thank you,<br><strong>The Foodhub Team</strong></p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <small style="color: #999;">If you did not request this OTP, please ignore this email.</small>
      </div>
    `,
    });

    console.log("OTP sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error };
  }
};

export const sendDeliveryAcceptedMail = async (user, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Foodhub" <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Delivery Confirmation OTP - Foodhub",
      text: `Hello ${user.fullName || "Customer"},

Your delivery confirmation OTP is: ${otp}

Please share this OTP only with the delivery partner upon receiving your order.

- Foodhub Team`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #FF5722;">Foodhub</h2>
          <p>Hello ${user.fullName || "Customer"},</p>
          <p>Your delivery confirmation OTP is:</p>
          <h3 style="color:#007BFF;">${otp}</h3>
          <p>Please share this OTP <strong>only</strong> with the delivery partner upon delivery.</p>
          <p>Thank you for choosing <strong>Foodhub</strong>!</p>
        </div>
      `,
    });

    console.log("Delivery OTP sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending delivery OTP:", error);
    return { success: false, error };
  }
};
