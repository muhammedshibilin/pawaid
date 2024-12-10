import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();


const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT, // Client ID
  process.env.SECRET, // Client Secret
  process.env.REDIRECT_URI // Redirect URI
);

// Set refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH,
});

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.USER,
    clientId: process.env.CLIENT,
    clientSecret: process.env.SECRET,
    refreshToken: process.env.REFRESH,
    accessToken: async () => {
      const { token } = await oAuth2Client.getAccessToken();
      if (!token) throw new Error('Failed to generate access token');
      return token;
    },
  },
});

// Function to send email
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: process.env.USER,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
};
