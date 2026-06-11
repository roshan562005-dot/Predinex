"use client";

import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsPage() {
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
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <FileText size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Terms of Service</h1>
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600 font-medium">
            <p className="text-sm text-gray-400">Last updated: March 15, 2026</p>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>By using the Predinex application, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Not Medical Advice</h2>
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-900 text-sm font-bold">
                IMPORTANT: Predinex is an informational tool and does NOT provide medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. User Responsibility</h2>
              <p>You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to provide accurate information when using the app.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Limitation of Liability</h2>
              <p>Predinex shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the application.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will notify users of any significant changes by posting the new terms on this page.</p>
            </section>

            <footer className="pt-12 border-t border-gray-100 mt-12">
              <p className="text-sm text-gray-500 italic">For any questions regarding these terms, please contact us at predinexlegal@gmail.com</p>
            </footer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
