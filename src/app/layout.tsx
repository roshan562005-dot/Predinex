import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { Viewport } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://predinex.com'),
  title: {
    default: "Predinex | Advanced Metabolic Health & Pre-Diabetes Prevention",
    template: "%s | Predinex"
  },
  description:
    "Predinex provides evidence-based metabolic health tracking, personalized lifestyle interventions, and clinical risk assessments to prevent pre-diabetes naturally.",
  keywords: ["pre-diabetes prevention", "metabolic health tracking", "insulin resistance diet", "blood sugar monitoring app", "clinical wellness"],
  manifest: "/manifest.json",
  authors: [{ name: "A. Roshan", url: "https://predinex.com/founder" }],
  openGraph: {
    title: "Predinex | Prevent Diabetes Before It Begins",
    description: "Personalised metabolic health plans to reverse pre-diabetes naturally.",
    url: "/",
    siteName: "Predinex",
    type: "website",
    images: [
      {
        url: "/images/predinex_hex_3d.png", // Adjust to your preferred OG image
        width: 1200,
        height: 630,
        alt: "Predinex Metabolic Health Platform"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Predinex | Advanced Metabolic Health",
    description: "Take control of your metabolic health with evidence-based tracking and prevention.",
    images: ["/images/predinex_hex_3d.png"],
  },
  appleWebApp: {
    capable: true,
    title: "Predinex",
    statusBarStyle: "black-translucent",
  },
  alternates: {
    canonical: "/"
  }
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalOrganization",
              "name": "Predinex",
              "url": "https://predinex.com",
              "logo": "https://predinex.com/images/logo.png",
              "description": "Predinex provides evidence-based metabolic health tracking, personalized lifestyle interventions, and clinical risk assessments to prevent pre-diabetes naturally.",
              "founder": {
                "@type": "Person",
                "name": "A. Roshan"
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
