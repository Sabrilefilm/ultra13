
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import { Footer } from "@/components/layout/Footer";
import { Rocket } from "lucide-react";

interface AuthViewProps {
  onLogin: (username: string, password: string) => void;
}

export const AuthView = ({ onLogin }: AuthViewProps) => {
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <div className="flex flex-1 items-center justify-center flex-col p-6">
        <div className="mb-6 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-8 h-8 text-purple-500 animate-pulse" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              ULTRA
            </h1>
          </div>
          <h2 className="text-lg text-white/70">by Phocéen Agency</h2>
        </div>
        
        <div className="w-full max-w-md">
          <LoginForm
            onLogin={onLogin}
            onForgotPassword={() => setIsForgotPasswordModalOpen(true)}
          />
        </div>
      </div>
      
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
      />
      <Footer />
    </div>
  );
};
