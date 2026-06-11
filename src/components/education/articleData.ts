export interface ArticleDetails {
  clinicalSummary: string;
  sections: { title: string; content: string }[];
  takeaways: string[];
}

export const articleData: Record<string, ArticleDetails> = {
  "Understanding Insulin Resistance": {
    clinicalSummary: "Insulin resistance is a physiological condition where cells fail to respond effectively to insulin, causing elevated blood glucose. Reversing it requires a combination of muscle activation, dietary modification, and stress reduction.",
    sections: [
      {
        title: "The Cellular Mechanism",
        content: "When you consume carbohydrates, they are broken down into glucose, which enters your bloodstream. In response, your pancreas secretes insulin—a hormone that acts as a 'key' to open glucose channels in your muscle, fat, and liver cells. In insulin resistance, the receptors on these cells become desensitized. The pancreas must work harder, secreting increasingly high levels of insulin to force glucose into cells."
      },
      {
        title: "The Danger of Beta-Cell Exhaustion",
        content: "Over time, the beta-cells in your pancreas can become exhausted from constantly overproducing insulin. When insulin secretion can no longer compensate for cellular resistance, blood sugar levels rise above normal, resulting in pre-diabetes and ultimately Type 2 Diabetes."
      },
      {
        title: "Reversal Strategies",
        content: "Insulin resistance is not a permanent state. By engaging in resistance training (which recruits insulin-independent glucose transporters like GLUT4), reducing simple carbohydrate intake, and prioritizing sleep, you can restore insulin sensitivity at a cellular level."
      }
    ],
    takeaways: [
      "Walk for 10-15 minutes immediately after meals to activate skeletal muscle glucose clearance.",
      "Reduce simple starches and processed sugars to decrease pancreatic load.",
      "Incorporate strength training twice a week to build glucose-storing muscle tissue."
    ]
  },
  "How Sleep Affects Your Blood Sugar": {
    clinicalSummary: "Sleep deprivation triggers cortisol and adrenaline release, directly inducing acute insulin resistance and impairing glucose tolerance.",
    sections: [
      {
        title: "The Circadian Rhythm & Metabolism",
        content: "Your metabolic health operates on a 24-hour internal clock. Sleep restriction to under 6 hours a night disrupts this circadian rhythm, mimicking a state of physiological stress. This triggers the release of stress hormones like cortisol and growth hormone."
      },
      {
        title: "Hormonal Imbalance",
        content: "Elevated cortisol acts as an antagonist to insulin, instructing the liver to release stored glucose into the bloodstream while simultaneously reducing cellular glucose uptake. Additionally, sleep deprivation decreases leptin (the satiety hormone) and increases ghrelin (the hunger hormone), leading to carbohydrate cravings."
      },
      {
        title: "Optimizing Rest for Recovery",
        content: "Achieving 7 to 8 hours of quality, uninterrupted sleep allows your body to enter deep slow-wave sleep, during which growth hormone drops and insulin sensitivity is restored."
      }
    ],
    takeaways: [
      "Maintain a consistent sleep-wake schedule, even on weekends.",
      "Avoid caffeine and heavy meals within 6 hours of bedtime.",
      "Limit blue-light exposure from screens at least 1 hour before sleep."
    ]
  },
  "10 Swaps for a Low Glycemic Index Diet": {
    clinicalSummary: "Swapping high-glycemic foods for low-glycemic, fiber-rich options prevents blood glucose spikes, reducing insulin demand and managing body weight.",
    sections: [
      {
        title: "Understanding Glycemic Index (GI)",
        content: "The Glycemic Index (GI) is a rating system from 0 to 100 that measures how quickly a carbohydrate-containing food raises blood sugar. High-GI foods (70+) digest rapidly, causing sharp spikes. Low-GI foods (<55) digest slowly, providing steady energy."
      },
      {
        title: "Top 5 Dietary Swaps",
        content: "1. Swap White Rice (GI 72) for Quinoa (GI 53) or Cauliflower Rice (GI 15).\n2. Swap White Bread (GI 75) for Whole Grain Sourdough (GI 54).\n3. Swap Instant Oats (GI 79) for Steel-Cut Oats (GI 52).\n4. Swap Sugary Soda (GI 63) for Infused Sparkling Water (GI 0).\n5. Swap Potato Chips (GI 70) for Mixed Raw Nuts (GI 14)."
      },
      {
        title: "The Power of Fiber, Protein, and Fat Pairing",
        content: "Adding healthy fats, fiber-rich vegetables, or lean protein to a meal lowers its overall glycemic impact. This slows gastric emptying, ensuring glucose enters the blood gradually."
      }
    ],
    takeaways: [
      "Pair any carbohydrate with a source of protein and healthy fat.",
      "Incorporate non-starchy vegetables (broccoli, spinach) at the beginning of each meal.",
      "Check food labels for high-fiber, low-sugar options."
    ]
  },
  "The Apple Ecosystem & Your Metabolism": {
    clinicalSummary: "Integrating wearables like the Apple Watch with Continuous Glucose Monitors (CGMs) provides real-time biomarkers to dynamically manage insulin sensitivity.",
    sections: [
      {
        title: "Continuous Metabolic Monitoring",
        content: "Modern wearable devices allow users to correlate daily movement, heart rate variability (HRV), and sleep stages with glucose logs. This feedback loop helps patients see how specific behaviors instantly affect their physical state."
      },
      {
        title: "Activity Tracking & GLUT4 Activation",
        content: "The Apple Watch detects active minutes and steps. Regular short walks trigger GLUT4 transporters in skeletal muscles, allowing cells to clear glucose without requiring extra insulin. Wearable alerts can remind users to walk after a large meal."
      },
      {
        title: "Stress and Autonomic Balance",
        content: "By tracking resting heart rate and HRV, the ecosystem monitors sympathetic nervous system dominance. Stress management features, like breathing exercises, lower cortisol levels, improving metabolic resilience."
      }
    ],
    takeaways: [
      "Sync your wearable with Predinex to automatically log step counts and sleep duration.",
      "Use post-meal activity tracking alerts to prompt a 10-minute walk.",
      "Monitor resting heart rate trends to gauge improvements in physical fitness."
    ]
  },
  "The Genetic Roots of Longevity": {
    clinicalSummary: "Activating longevity genes through metabolic interventions is directly tied to improving insulin sensitivity and mitochondrial health.",
    sections: [
      {
        title: "Longevity Pathways: AMPK and Sirtuins",
        content: "Research indicates that longevity is governed by metabolic sensing pathways. The key regulator is AMPK (AMP-activated protein kinase), which turns on when cellular energy is low, promoting glucose uptake and fat oxidation. Sirtuins (SIRT1-7) are longevity proteins that depend on NAD+ and regulate cellular repair and inflammation."
      },
      {
        title: "The Role of Caloric Regulation",
        content: "Chronically elevated insulin suppresses AMPK and sirtuins, accelerating cellular aging. Managing blood glucose levels through low-GI eating and periodic fasting simulates nutrient scarcity, activating these protective longevity genes."
      },
      {
        title: "Mitochondrial Biogenesis",
        content: "Activating AMPK stimulates the growth of new, healthy mitochondria (the powerhouses of your cells). More mitochondria mean more efficient glucose burning and fewer free radicals, reducing overall chronic inflammation."
      }
    ],
    takeaways: [
      "Implement a structured 12-to-14 hour overnight fasting window to activate cellular cleanup (autophagy).",
      "Focus on polyphenol-rich foods (olive oil, berries) that support sirtuin activation.",
      "Exercise regularly to stimulate mitochondrial growth and improve longevity markers."
    ]
  },
  "Visualizing the Next Generation Healthcare UI": {
    clinicalSummary: "Empowering patients to manage chronic conditions requires presenting complex biomarker trends in clean, interactive, and clinically relevant designs.",
    sections: [
      {
        title: "From Jargon to Visual Insight",
        content: "Traditional clinical reports are often complex and hard for patients to interpret. Next-generation healthcare interfaces bridge this gap by converting raw statistics into dynamic, visual models like 3D metabolic projections, interactive charts, and clear risk indicators."
      },
      {
        title: "The Behavioral Feedback Loop",
        content: "By showing immediate visual feedback (such as a progress bar filling up as habits are logged), the interface acts as positive reinforcement. When patients see their vital metrics and risk indicators respond in real-time, compliance rates increase."
      },
      {
        title: "Accessibility & Personalization",
        content: "A premium healthcare interface must accommodate diverse patient populations, offering options for simple modes, multiple languages, and clear text hierarchies. This ensures that essential health data remains clear and accessible for all users."
      }
    ],
    takeaways: [
      "Use the Predinex interactive dashboard to monitor your vital signs daily.",
      "Consult the visual trends chart weekly to see the correlation between your habits and risk score.",
      "Share your digital progress report with your healthcare provider during visits."
    ]
  }
};
