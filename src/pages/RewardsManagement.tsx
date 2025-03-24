
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RewardsPanel } from "@/components/RewardsPanel";
import { Footer } from "@/components/layout/Footer";
import { useIndexAuth } from "@/hooks/use-index-auth";

const RewardsManagement = () => {
  const navigate = useNavigate();
  const { role } = useIndexAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
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

        <RewardsPanel role="founder" userId="founder" />
        
        <Footer role={role} version="1.3" />
      </div>
    </div>
  );
};

export default RewardsManagement;
