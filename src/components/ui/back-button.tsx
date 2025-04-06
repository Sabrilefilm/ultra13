
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  returnTo?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ className = "", returnTo = "/" }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(returnTo);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleGoBack}
      className={`h-10 w-10 bg-slate-800/50 hover:bg-slate-700/50 text-white ${className}`}
      aria-label="Retour à l'accueil"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};
