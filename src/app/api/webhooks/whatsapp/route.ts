import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { upsertHabits } from '@/lib/db-queries';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const from = formData.get('From') as string; // e.g. "whatsapp:+919876543210"
    const body = formData.get('Body') as string; // e.g. "I ate 2 rotis and a salad"

    if (!from || !body) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Clean the phone number to match the DB
    const phoneStr = from.replace('whatsapp:+', '');
    
    // 2. Find the user by phone
    const { data: user } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('phone', phoneStr)
      .maybeSingle();

    if (!user) {
      // If user not found, we could prompt them to sign up
      await sendWhatsAppMessage(from, "Welcome to Predinex! We couldn't find an account with this number. Please register at https://predinex.com to activate your AI Dietitian.");
      return NextResponse.json({ success: true }); // Always return 200 to Twilio
    }

    const lowerBody = body.toLowerCase();
    const today = new Date().toISOString().split('T')[0];

    // 3. Smart "AI" Keyword Parsing Engine
    let detectedFood = "";
    let estimatedGlucoseSpike = 0;
    
    // Simple logic engine to mimic AI parsing
    if (lowerBody.includes('roti') || lowerBody.includes('chapati')) {
      detectedFood = "Roti/Chapati";
      estimatedGlucoseSpike = 35; // mg/dL
    } else if (lowerBody.includes('rice') || lowerBody.includes('biryani')) {
      detectedFood = "Rice";
      estimatedGlucoseSpike = 55;
    } else if (lowerBody.includes('salad') || lowerBody.includes('veg')) {
      detectedFood = "Salad/Veggies";
      estimatedGlucoseSpike = 10;
    } else if (lowerBody.includes('paneer') || lowerBody.includes('chicken')) {
      detectedFood = "Protein (Paneer/Chicken)";
      estimatedGlucoseSpike = 15;
    } else if (lowerBody.includes('sugar') || lowerBody.includes('sweet') || lowerBody.includes('cake')) {
      detectedFood = "High-Sugar Food";
      estimatedGlucoseSpike = 80;
    } else if (lowerBody.includes('idli') || lowerBody.includes('dosa')) {
      detectedFood = "Idli/Dosa";
      estimatedGlucoseSpike = 45;
    } else {
      // If we don't recognize the food, ask for clarification
      await sendWhatsAppMessage(from, `🤖 *Predinex AI:*\n\nI couldn't quite recognize that meal. Try telling me the specific ingredients (e.g. "I ate 2 rotis and paneer").`);
      return NextResponse.json({ success: true });
    }

    // 4. Update the User's Daily Habits (simulate a blood sugar log based on the food)
    // Get their current habits to add to it, or just set the blood sugar
    const { data: currentHabit } = await supabase
      .from('daily_habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    const currentSpike = currentHabit?.blood_sugar ? currentHabit.blood_sugar : 90; // base 90 fasting
    const newSpike = currentSpike + estimatedGlucoseSpike;

    await upsertHabits(user.id, today, {
      blood_sugar: newSpike > 200 ? 200 : newSpike // Cap at 200 for demo safety
    });

    // 5. Send AI Assessment back via WhatsApp
    let feedbackMsg = `🤖 *Predinex AI Logged Your Meal*\n\n`;
    feedbackMsg += `*Detected:* ${detectedFood}\n`;
    feedbackMsg += `*Estimated Glucose Spike:* +${estimatedGlucoseSpike} mg/dL\n`;
    
    if (estimatedGlucoseSpike >= 50) {
      feedbackMsg += `\n⚠️ *Clinical Warning:* This meal is high-glycemic. Try walking for 15 minutes right now to blunt the insulin spike!`;
    } else if (estimatedGlucoseSpike <= 20) {
      feedbackMsg += `\n✅ *Excellent:* This is a highly metabolic-friendly meal. Your insulin resistance is thanking you.`;
    } else {
      feedbackMsg += `\nℹ️ *Tip:* Good choice, but consider pairing it with more fiber next time to lower the glycemic load.`;
    }

    feedbackMsg += `\n\n_Your progress dashboard has been automatically updated._`;

    await sendWhatsAppMessage(from, feedbackMsg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
