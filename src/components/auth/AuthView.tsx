
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";

interface AuthViewProps {
  onLogin: (username: string, password: string) => void;
}

export const AuthView = ({
  onLogin
}: AuthViewProps) => {
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col w-full h-full justify-center">
      <LoginForm 
        onLogin={onLogin} 
        onForgotPassword={() => setIsForgotPasswordModalOpen(true)} 
      />
      
      <ForgotPasswordModal 
        isOpen={isForgotPasswordModalOpen} 
        onClose={() => setIsForgotPasswordModalOpen(false)} 
      />
    </div>
  );
};
