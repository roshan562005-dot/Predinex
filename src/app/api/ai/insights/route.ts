import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { insight: "[DEMO MODE] To activate real AI insights, please add GEMINI_API_KEY to your .env.local file. Based on your current telemetry, your metabolic stability is strong, but focus on lowering evening cortisol for better glucose regulation." },
        { status: 200 } // Send a mock response so the UI still looks good without the key
      );
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
