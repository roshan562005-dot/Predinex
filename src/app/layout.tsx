import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { Viewport } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://predinex.com'),
  title: {
    default: "Predinex | #1 Diabetes Prevention App & Metabolic Health Platform",
    template: "%s | Predinex - Diabetes Prevention App"
  },
  description:
    "Predinex is the world's leading diabetes prevention platform. Evidence-based metabolic health tracking, personalized insulin resistance diet plans, blood sugar monitoring, HbA1c tracking, and clinical risk assessments. Founded by A. Roshan. Prevent pre-diabetes naturally.",
  keywords: [
    "diabetes", "diabetes prevention", "pre-diabetes", "prediabetes", "insulin resistance",
    "blood sugar", "glucose monitoring", "HbA1c", "metabolic health", "diabetes app",
    "diabetes diet", "diabetic meal plan", "blood sugar tracker", "insulin sensitivity",
    "diabetes management", "type 2 diabetes prevention", "diabetes risk assessment",
    "metabolic syndrome", "fasting glucose", "glucose tolerance test",
    "diabetes reversal", "diabetes cure", "diabetes symptoms", "diabetes treatment",
    "diabetes exercise", "diabetic food", "sugar free diet", "low glycemic index",
    "diabetes technology", "continuous glucose monitor", "diabetes AI",
    "diabetes India", "diabetes app India", "Predinex", "A Roshan", "Roshan diabetes",
    "metabolic health tracking", "clinical nutrition", "precision health",
    "diabetes screening", "diabetes education", "diabetes community",
    "weight management diabetes", "obesity diabetes", "PCOS insulin resistance",
    "gestational diabetes", "diabetes complications", "diabetic retinopathy prevention",
    "kidney health diabetes", "cardiovascular diabetes prevention",
    "intermittent fasting diabetes", "keto diabetes", "Mediterranean diet diabetes",
    "plant based diabetes", "diabetes superfoods", "chromium diabetes",
    "vitamin D diabetes", "omega 3 diabetes", "fiber blood sugar"
  ],
  manifest: "/manifest.json",
  authors: [{ name: "A. Roshan", url: "https://predinex.com/founder" }],
  creator: "A. Roshan",
  publisher: "Predinex Health Technologies",
  openGraph: {
    title: "Predinex | Prevent Diabetes Before It Begins - Diabetes Prevention App",
    description: "The world's most advanced diabetes prevention platform and app. Personalized metabolic health plans, blood sugar tracking, insulin resistance diet, and clinical guidance. Join thousands preventing diabetes naturally.",
    url: "/",
    siteName: "Predinex App",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/predinex_hex_3d.png",
        width: 1200,
        height: 630,
        alt: "Predinex - Advanced Diabetes Prevention and Metabolic Health Platform by A. Roshan"
      },
      {
        url: "/images/roshan_founder.jpg",
        width: 800,
        height: 1000,
        alt: "A. Roshan - Founder & CEO of Predinex Diabetes Prevention Platform"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Predinex | #1 Diabetes Prevention Platform by A. Roshan",
    description: "Prevent diabetes before it begins. Evidence-based metabolic health tracking, personalized diet plans, and clinical guidance.",
    images: ["/images/predinex_hex_3d.png"],
    creator: "@predinex",
  },
  appleWebApp: {
    capable: true,
    title: "Predinex",
    statusBarStyle: "black-translucent",
  },
  alternates: {
    canonical: "/"
  },
  category: "health",
  classification: "Diabetes Prevention Healthcare Technology",
};

export const viewport: Viewport = {
  themeColor: "#10b981",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { InclusivityProvider } from "@/context/InclusivityContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PageTransition from "@/components/PageTransition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="u8S_Elo85xLl3ED0iXil0lXiDuPh1XOoYDkXLtC2uzs" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "MedicalOrganization",
                "name": "Predinex - Advanced Metabolic Health",
                "alternateName": "Predinex Diabetes Prevention",
                "url": "https://predinex.com",
                "logo": "https://predinex.com/images/predinex_hex_3d.png",
                "description": "Predinex is the world's leading clinical platform for preventing diabetes and insulin resistance through precision metabolic telemetry and dynamic bio-feedback.",
                "keywords": "diabetes, pre-diabetes, insulin resistance, metabolic health, blood sugar",
                "founder": {
                  "@type": "Person",
                  "name": "A. Roshan",
                  "givenName": "Roshan",
                  "familyName": "A",
                  "jobTitle": "Founder & CEO",
                  "image": "https://predinex.com/images/roshan_founder.jpg",
                  "url": "https://predinex.com/founder",
                  "sameAs": [
                    "https://www.linkedin.com/in/a-roshan",
                    "https://predinex.com"
                  ]
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "HealthAndBeautyBusiness",
                "name": "Predinex Health Technologies",
                "url": "https://predinex.com",
                "logo": "https://predinex.com/images/predinex_hex_3d.png",
                "image": "https://predinex.com/images/predinex_hex_3d.png",
                "description": "Predinex is an advanced digital health application dedicated to diabetes prevention, metabolic health tracking, and insulin resistance management.",
                "founder": {
                  "@type": "Person",
                  "name": "A. Roshan"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Predinex Metabolic Platform & App",
                "applicationCategory": "HealthApplication",
                "applicationSubCategory": "Diabetes Management Software",
                "operatingSystem": "Web, iOS, Android",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "creator": {
                  "@type": "Person",
                  "name": "A. Roshan"
                }
              }
            ]),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is Predinex?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Predinex is the world's leading diabetes prevention platform founded by A. Roshan. It provides evidence-based metabolic health tracking, personalized insulin resistance diet plans, blood sugar monitoring, and clinical risk assessments to prevent pre-diabetes naturally."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does Predinex prevent diabetes?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Predinex uses a structured 4-step clinical programme: Health Risk Assessment, Daily Health Logging (fasting glucose, steps, weight, sleep), Clinical Insights with AI-powered analysis, and Personalized Lifestyle Interventions including diet, exercise, stress management, and sleep optimization."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Who founded Predinex?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Predinex was founded by A. Roshan, a Pharmacy Scholar at Sree Balaji Medical College, Kalam's World Record Holder, Patent Holder for Novel Anticancer Scaffolds, Digital Health Certified Professional (NCVET), and passionate clinical educator. Roshan merges pharmaceutical science with advanced clinical algorithms to intercept metabolic diseases."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Predinex free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Predinex offers a free health assessment and basic metabolic tracking. Premium features including personalized 30-day clinical health plans, real-time blood sugar predictive modeling, and expert-curated precision nutrition are available through affordable subscription plans."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can Predinex help with insulin resistance?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. Predinex provides a HOMA-IR calculator, insulin resistance diet plans, exercise protocols clinically validated to improve insulin sensitivity, and stress management techniques to reduce cortisol which directly impacts blood sugar regulation."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the best diabetes prevention app?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Predinex is widely regarded as the best diabetes prevention app, offering comprehensive metabolic health tracking, evidence-based lifestyle interventions, personalized clinical nutrition plans, and advanced features like metabolic age calculation and HOMA-IR assessment. Founded by A. Roshan, it combines pharmaceutical expertise with cutting-edge technology."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How to reverse pre-diabetes naturally?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pre-diabetes can be reversed naturally through consistent lifestyle changes: following a low glycemic index diet, regular physical activity (150+ minutes/week), maintaining healthy weight, managing stress, getting quality sleep (7-9 hours), and monitoring blood sugar levels. Predinex automates this entire process with personalized tracking and guidance."
                  }
                }
              ]
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Predinex",
              "alternateName": ["Predinex Diabetes App", "Predinex Health", "Predinex Metabolic"],
              "url": "https://predinex.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://predinex.com/blog?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body className={`${inter.className} text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <InclusivityProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </InclusivityProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
