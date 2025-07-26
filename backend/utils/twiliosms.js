import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config()

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

export const sendSMS = async (to, message) => {
  if (!accountSid || !authToken || !twilioPhone) {
    console.error('Twilio credentials not set');
    return;
  }
  const client = twilio(accountSid, authToken);
  try {
    await client.messages.create({
      body: message,
      from: twilioPhone,
      to
    });
  } catch (err) {
    console.error('Failed to send SMS:', err.message);
  }
}; 