
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RewardsPanel } from "@/components/RewardsPanel";
import { Footer } from "@/components/layout/Footer";
import { useIndexAuth } from "@/hooks/use-index-auth";

const RewardsManagement = () => {
  const navigate = useNavigate();
  const { role, username, userId } = useIndexAuth();

  // Create username watermark with multiple small instances
  const usernameWatermark = (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {Array.from({ length: 500 }).map((_, index) => (
        <div 
          key={index} 
          className="absolute text-[8px] font-bold text-slate-200/10" 
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          {username ? username.toUpperCase() : 'USER'}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      {/* Filigrame du nom d'utilisateur */}
      {usernameWatermark}
      
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Gestion des Récompenses 🏆</h1>
        </div>

        <RewardsPanel role={role || 'founder'} userId={userId || 'founder'} />
        
        <Footer role={role} version="1.3" />
      </div>
    </div>
  );
};

export default RewardsManagement;
