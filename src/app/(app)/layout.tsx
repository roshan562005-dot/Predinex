import { Sidebar } from "@/components/layout/Sidebar";
import { BotWidget } from "@/components/BotWidget";
import FeedbackWidget from "@/components/FeedbackWidget";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex text-gray-900 bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <main className="flex-1 pt-16 md:pt-0 max-h-screen overflow-y-auto relative">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-300/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-300/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto md:p-8 p-4 w-full relative z-10 pb-32">
          {children}
        </div>
      </main>
      <BotWidget />
      <FeedbackWidget />
    </div>
  );
}
