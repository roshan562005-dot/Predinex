export async function sendWhatsAppMessage(toPhone: string, messageBody: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Twilio sandbox default

  if (!accountSid || !authToken) {
    console.warn('Twilio credentials are not set. Skipping WhatsApp message.');
    console.warn(`[MOCK WHATSAPP to ${toPhone}]: ${messageBody}`);
    return false;
  }

  // Ensure the phone number has the 'whatsapp:' prefix and a + symbol
  let formattedPhone = toPhone.replace(/\D/g, ''); // Remove non-digits
  if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
    formattedPhone = `91${formattedPhone}`; // Assume India if 10 digits
  }
  const toParam = `whatsapp:+${formattedPhone}`;

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: toParam,
          Body: messageBody,
        }).toString(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Twilio Error:', errorData);
      return false;
    }

    const data = await response.json();
    console.log(`WhatsApp message sent successfully. SID: ${data.sid}`);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}
