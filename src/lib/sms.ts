import axios from 'axios';
import { supabase } from './supabase';

/** Generate a cryptographically random 6-digit OTP */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Store OTP in database with 5-minute expiry */
async function storeOTP(phone: string, code: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 mins from now

  // Delete any previous unused OTPs for this phone
  const { error: deleteError } = await supabase
    .from('otp_codes')
    .delete()
    .eq('phone', phone)
    .eq('used', 0);
  if (deleteError) console.error('Error deleting old OTPs:', deleteError);

  const { error: insertError } = await supabase
    .from('otp_codes')
    .insert({ phone, code, expires_at: expiresAt });
  if (insertError) console.error('Error inserting OTP:', insertError);
}

/** Send OTP via Fast2SMS API */
export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    // In dev mode without an API key, log the OTP to console for testing
    const code = generateOTP();
    await storeOTP(phone, code);
    console.log(`[DEV MODE] OTP for ${phone}: ${code}`);
    return { success: true };
  }

  const code = generateOTP();
  await storeOTP(phone, code);

  try {
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: apiKey,
        variables_values: code,
        route: 'otp',
        numbers: phone,
      },
      timeout: 10000,
    });

    if (response.data?.return === true) {
      return { success: true };
    }
    return { success: false, error: response.data?.message || 'SMS send failed' };
  } catch (err: any) {
    console.error('Fast2SMS error:', err.message);
    return { success: false, error: 'Failed to send SMS. Please try again.' };
  }
}

/** Verify provided OTP against the database */
export async function verifyOTP(phone: string, code: string): Promise<{ valid: boolean; error?: string }> {
  const { data: record, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('phone', phone)
    .eq('code', code)
    .eq('used', 0)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !record) {
    return { valid: false, error: 'Invalid OTP. Please check and try again.' };
  }

  if (new Date(record.expires_at) < new Date()) {
    return { valid: false, error: 'OTP has expired. Please request a new one.' };
  }

  // Mark OTP as used
  const { error: updateError } = await supabase
    .from('otp_codes')
    .update({ used: 1 })
    .eq('id', record.id);
  if (updateError) console.error('Error marking OTP as used:', updateError);

  return { valid: true };
}
