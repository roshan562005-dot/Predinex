import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      // Generate a smart fallback insight based on the patient's actual data
      const body = await req.json();
      const { insulinScore = 70, glucoseScore = 70, energyScore = 50, sleep = 0, water = 0 } = body;
      
      let insight = "";
      if (energyScore < 40) {
        insight = `Your lifestyle score needs attention — focus on hydration (${water < 1500 ? "aim for 2.5L water daily" : "great water intake"}) and sleep (${sleep < 7 ? "target 7-8 hours tonight" : "sleep is on track"}). Small daily habits compound into powerful metabolic improvements within 30 days.`;
      } else if (insulinScore >= 80 && glucoseScore >= 80) {
        insight = `Excellent metabolic stability detected. Your insulin sensitivity and glucose regulation are both in the optimal zone. Continue your current routine and monitor for sustained improvement over the next 2 weeks.`;
      } else if (insulinScore < 60 || glucoseScore < 60) {
        insight = `Your metabolic markers suggest room for improvement. Prioritize low-glycemic meals, 30 minutes of walking daily, and consistent sleep timing to boost your insulin sensitivity by up to 15% this month.`;
      } else {
        insight = `Your metabolic profile shows steady progress. ${sleep >= 7 ? "Your sleep pattern supports healthy cortisol regulation." : "Improving sleep to 7+ hours can significantly enhance glucose stability."} Keep tracking daily to unlock deeper insights.`;
      }
      
      return NextResponse.json({ insight }, { status: 200 });
    }

    const body = await req.json();
    const { insulinScore, glucoseScore, energyScore, sleep, water } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are Predinex's elite AI medical engine. Analyze the following real-time Metabolic BioTwin data for a patient and provide a short, punchy 2-sentence metabolic forecast focusing on diabetes prevention.
    
    Data:
    Insulin Sensitivity Score: ${insulinScore}/100
    Glucose Regulation Score: ${glucoseScore}/100
    Energy Score: ${energyScore}/100
    Sleep: ${sleep} hours
    Water: ${water} ml
    
    Output the forecast as a direct message to the patient. Keep it extremely brief (max 2 sentences), encouraging, and highly clinical. Do not use markdown asterisks.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ insight: text });
  } catch (error: any) {
    console.error("AI Insight Error:", error);
    return NextResponse.json(
      { insight: "System recalibrating. Advanced insights temporarily offline." },
      { status: 200 }
    );
  }
}
