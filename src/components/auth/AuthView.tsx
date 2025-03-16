import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import { Footer } from "@/components/layout/Footer";
import { Rocket } from "lucide-react";
interface AuthViewProps {
  onLogin: (username: string, password: string) => void;
}
export const AuthView = ({
  onLogin
}: AuthViewProps) => {
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  return <div className="flex flex-col min-h-screen bg-[#111827]">
      <div className="flex flex-1 items-center justify-center flex-col p-6">
        <div className="mb-6 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            
            
          </div>
          
        </div>
        
        <div className="w-full max-w-md">
          <LoginForm onLogin={onLogin} onForgotPassword={() => setIsForgotPasswordModalOpen(true)} />
        </div>
      </div>
      
      <ForgotPasswordModal isOpen={isForgotPasswordModalOpen} onClose={() => setIsForgotPasswordModalOpen(false)} />
      <Footer />
    </div>;
};