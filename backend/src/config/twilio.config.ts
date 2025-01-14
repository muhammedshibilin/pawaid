import Twilio from 'twilio';


const accountSid =process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioNumber = process.env.TWILIO_NUMBER;
const twilioClient = new Twilio(accountSid,authToken);

export async function sendOtp(to: string, otpCode: string) {
  try {
console.log(accountSid,authToken,twilioNumber,twilioClient)

    const formattedTo = `+91${to}`;
    console.log("Formatted To:", formattedTo);

    const message = await twilioClient.messages.create({
      body: `Your OTP is: ${otpCode}`,
      from: twilioNumber,
      to: formattedTo,
    });

    console.log(`Sent OTP to ${formattedTo}: ${message.sid}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}
