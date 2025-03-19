
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import { Footer } from "@/components/layout/Footer";

interface AuthViewProps {
  onLogin: (username: string, password: string) => void;
}

export const AuthView = ({
  onLogin
}: AuthViewProps) => {
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <div className="flex flex-1">
        <LoginForm 
          onLogin={onLogin} 
          onForgotPassword={() => setIsForgotPasswordModalOpen(true)} 
        />
      </div>
      
      <ForgotPasswordModal 
        isOpen={isForgotPasswordModalOpen} 
        onClose={() => setIsForgotPasswordModalOpen(false)} 
      />
      
      <Footer />
    </div>
  );
};
