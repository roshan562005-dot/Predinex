"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bug, Lightbulb, Type } from "lucide-react";
import { submitAppFeedback } from "@/app/(app)/actions";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("Bug");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await submitAppFeedback(type, message, currentUrl);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setMessage("");
      }, 2500);
    } catch (err) {
      console.error(err);
      alert("Error sending feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-900 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 hover:bg-black transition-all flex items-center justify-center border border-gray-700 relative group"
        >
          <MessageSquare size={24} />
          {/* Tooltip */}
          <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Beta Feedback
          </span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 left-0 w-[320px] bg-white rounded-2xl shadow-3xl border border-gray-200 overflow-hidden flex flex-col"
            >
              <div className="bg-gray-900 p-4 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">Beta Feedback</h3>
                  <p className="text-xs text-gray-400">Found an issue?</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {success ? (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                    <Send size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900">Sent to Engineering</h4>
                  <p className="text-sm text-gray-500 mt-1">Thanks for the catch!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                  <div className="flex gap-2">
                    {[
                      { icon: Bug, label: "Bug" },
                      { icon: Lightbulb, label: "Idea" },
                      { icon: Type, label: "Typo" },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setType(opt.label)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border transition-colors ${
                          type === opt.label
                            ? "bg-gray-900 border-gray-900 text-white shadow-md"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <opt.icon size={16} />
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    autoFocus
                    placeholder="Tell us what happened..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-24 bg-gray-50 rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none text-gray-800"
                  ></textarea>

                  <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Submit Report"}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
