"use client";

import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white p-8 md:p-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
              <Shield size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600 font-medium">
            <p className="text-sm text-gray-400">Last updated: March 15, 2026</p>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
              <p>Predinex collect health-related data you provide, including blood sugar readings, weight, step counts, and sleep duration. We also collect profile information such as your name and email address provided during authentication.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Data</h2>
              <p>Your data is used exclusively to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide personalized risk assessments and health plans.</li>
                <li>Generate progress charts and trends.</li>
                <li>Personalize Health Bot responses.</li>
                <li>Improve the overall user experience and application features.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
              <p>We use industry-standard security measures, including Supabase Row Level Security (RLS) and encrypted data transmission, to protect your personal information from unauthorized access.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Sharing Your Information</h2>
              <p>Predinex does not sell or share your personal health data with third-party advertisers. Your data is stored securely and is only accessible by you unless you explicitly choose to share it.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
              <p>You have the right to access, correct, or delete your data at any time through the application settings or by contacting our support team.</p>
            </section>

            <footer className="pt-12 border-t border-gray-100 mt-12">
              <p className="text-sm text-gray-500 italic">If you have any questions about this Privacy Policy, please contact us at predinexsupport@gmail.com</p>
            </footer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
