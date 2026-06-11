export interface LangConfig {
  name: string;
  flag: string;
  code: string;
  narrations: string[];
}

export const LANGUAGES: Record<string, LangConfig> = {
  en: {
    name: "English", flag: "🇬🇧", code: "en-US",
    narrations: [
      `Welcome to this Prednix lecture on how carbohydrates impact your health. Over seven chapters, you will learn how different carbs affect your blood sugar, energy, and long-term diabetes risk. Let's begin.`,
      `Carbohydrates come in three types. Simple carbs like candy and white bread cause rapid blood sugar spikes and crashes. Complex carbs like whole grains release energy slowly and steadily. Dietary fiber is indigestible but feeds healthy gut bacteria and stabilises glucose. Your brain uses one hundred and twenty grams of glucose every day — but quality matters more than quantity.`,
      `Here are the five steps of carbohydrate metabolism. One: Digestion — enzymes break carbs into glucose. Two: Absorption — glucose enters your bloodstream, raising blood sugar. Three: Insulin Release — your pancreas secretes insulin to unlock cells. Four: Cellular Fuel — glucose powers ATP production, your energy currency. Five: Storage or Fat — surplus glucose stores as glycogen, or converts to body fat when stores are full.`,
      `This chart shows blood sugar over three hours. Simple carbs cause a dangerous spike above one hundred and seventy before crashing below normal. Complex carbs show a moderate rise. High-fiber low-GI foods produce a nearly flat, stable line. Warning: repeated spikes damage blood vessels and exhaust your pancreas, driving pre-diabetes and Type 2 diabetes.`,
      `The Glycemic Index ranks foods zero to one hundred by how fast they raise blood sugar. White bread scores seventy-five, white rice seventy-two. In contrast, oats score fifty-five, sweet potato forty-four, lentils thirty-two, and broccoli just ten. Target foods below fifty-five. Limit those between fifty-five and seventy. Minimise anything above seventy.`,
      `Our radar chart compares smart versus poor carb choices across six health dimensions. Smart carbs score ninety percent for energy stability versus forty percent for poor carbs. Insulin sensitivity: eighty-five versus thirty-three. Brain function: eighty-eight versus forty-four. Gut health: ninety-two versus just twenty-two percent. Every meal shapes your cellular health.`,
      `Your action plan has six steps. One: choose low GI foods. Two: time carbs in the morning or pre-workout. Three: always pair carbs with fiber and protein. Four: walk ten minutes after meals — this reduces blood sugar by twenty-two percent. Five: stay well hydrated. Six: track your blood sugar in Prednix to watch your trends improve. Lecture complete — knowledge is your best prevention.`,
    ],
  },

  hi: {
    name: "हिंदी", flag: "🇮🇳", code: "hi-IN",
    narrations: [
      `वेलिक्स लेक्चर में आपका स्वागत है। आज हम सात अध्यायों में सीखेंगे कि कार्बोहाइड्रेट आपके रक्त शर्करा, ऊर्जा और मधुमेह जोखिम को कैसे प्रभावित करते हैं। चलिए शुरू करते हैं।`,
      `कार्बोहाइड्रेट तीन प्रकार के होते हैं। सरल कार्बोहाइड्रेट जैसे मिठाई और सफेद ब्रेड रक्त शर्करा में तेज उछाल लाते हैं। जटिल कार्बोहाइड्रेट जैसे साबुत अनाज धीरे-धीरे ऊर्जा देते हैं। आहार फाइबर पाचन तंत्र में अच्छे बैक्टीरिया को पोषण देता है और ग्लूकोज को स्थिर रखता है। आपका मस्तिष्क प्रतिदिन एक सौ बीस ग्राम ग्लूकोज उपयोग करता है, लेकिन गुणवत्ता मात्रा से अधिक महत्वपूर्ण है।`,
      `कार्बोहाइड्रेट के चयापचय के पाँच चरण हैं। एक: पाचन — एंजाइम कार्बोहाइड्रेट को ग्लूकोज में तोड़ते हैं। दो: अवशोषण — ग्लूकोज रक्तप्रवाह में प्रवेश करता है। तीन: इन्सुलिन स्राव — अग्न्याशय इन्सुलिन उत्पन्न करता है। चार: कोशिकीय ऊर्जा — ग्लूकोज ATP उत्पादन करता है। पाँच: भंडारण या वसा — अतिरिक्त ग्लूकोज ग्लाइकोजन या शरीर की चर्बी में बदल जाता है।`,
      `यह चार्ट तीन घंटों में रक्त शर्करा दिखाता है। सरल कार्बोहाइड्रेट खतरनाक उछाल पैदा करते हैं। जटिल कार्बोहाइड्रेट मध्यम वृद्धि दिखाते हैं। उच्च फाइबर वाले खाद्य पदार्थ लगभग स्थिर रेखा बनाते हैं। चेतावनी: बार-बार होने वाले उछाल रक्त वाहिकाओं को नुकसान पहुंचाते हैं और प्री-डायबिटीज का कारण बनते हैं।`,
      `ग्लाइसेमिक इंडेक्स खाद्य पदार्थों को शून्य से सौ तक रैंक करता है। सफेद ब्रेड पचहत्तर, सफेद चावल बहत्तर स्कोर करते हैं। जई पचपन, शकरकंद चौवालीस, दालें बत्तीस और ब्रोकोली दस स्कोर करती है। पचपन से नीचे के खाद्य पदार्थ चुनें।`,
      `हमारा राडार चार्ट छह स्वास्थ्य आयामों में स्मार्ट और खराब कार्बोहाइड्रेट की तुलना करता है। स्मार्ट कार्बोहाइड्रेट ऊर्जा स्थिरता के लिए नब्बे प्रतिशत स्कोर करते हैं। इन्सुलिन संवेदनशीलता पचासी प्रतिशत। मस्तिष्क कार्य अठासी प्रतिशत। आंत स्वास्थ्य बानवे प्रतिशत। हर भोजन आपकी कोशिकाओं को प्रभावित करता है।`,
      `आपकी कार्य योजना में छह कदम हैं। एक: कम जीआई खाद्य पदार्थ चुनें। दो: सुबह या व्यायाम से पहले कार्बोहाइड्रेट लें। तीन: कार्बोहाइड्रेट के साथ फाइबर और प्रोटीन लें। चार: भोजन के बाद दस मिनट टहलें, यह रक्त शर्करा को बाईस प्रतिशत कम करता है। पाँच: पर्याप्त पानी पिएं। छह: वेलिक्स में अपनी प्रगति ट्रैक करें। बधाई हो — व्याख्यान पूर्ण हुआ।`,
    ],
  },
};

export const CHAPTERS = [
  { id: 0, title: "Introduction",      emoji: "🔬", duration: 38  },
  { id: 1, title: "What Are Carbs?",   emoji: "🍞", duration: 55  },
  { id: 2, title: "How They Work",     emoji: "⚙️", duration: 70  },
  { id: 3, title: "Blood Sugar",       emoji: "📈", duration: 58  },
  { id: 4, title: "Glycemic Index",    emoji: "🎯", duration: 52  },
  { id: 5, title: "Metabolic Impact",  emoji: "🧬", duration: 55  },
  { id: 6, title: "Action Plan",       emoji: "✅", duration: 65  },
];

export const TOTAL_DURATION = CHAPTERS.reduce((s, c) => s + c.duration, 0);
export const chapterStart = (idx: number) => CHAPTERS.slice(0, idx).reduce((s, c) => s + c.duration, 0);
