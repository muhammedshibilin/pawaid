import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('credentials: ', process.env.EMAIL_USER, process.env.EMAIL_PASS);
    console.error('SMTP server connection error:', error);
  } else {
    console.log('SMTP server connection successful');
  }
});

export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<void> => {
  console.log('credentials: ', process.env.EMAIL_USER, process.env.EMAIL_PASS);
  if (!to || !subject || !html) {
    throw new Error('Missing required email parameters');
  }

  try {
    console.log(`Attempting to send email to: ${to}`);
    
    const info = await transporter.sendMail({
      from: `PawAid <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
    
  } catch (error: any) {
    console.error('Error while sending email:', error);
    
    if (error.code === 'EAUTH') {
      throw new Error('Authentication failed. Please check your Gmail credentials and app password.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Connection to email server was refused. Check your network settings.');
    } else {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

export default sendEmail;
