
import React from "react";
import { Diamond, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface DiamondsSectionProps {
  totalDiamonds: number;
  isLoading: boolean;
}

export const DiamondsSection = ({ totalDiamonds, isLoading }: DiamondsSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-4 p-4 bg-indigo-900/20 border border-indigo-700/30 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-indigo-300 flex items-center gap-2">
          <Diamond className="h-4 w-4" />
          Vos diamants 💎
        </h4>
      </div>
      
      <div className="text-center mb-2">
        <motion.span 
          initial={{scale: 0.9, opacity: 0}} 
          animate={{scale: 1, opacity: 1}} 
          transition={{duration: 0.5}} 
          className="block text-3xl font-bold text-indigo-300"
        >
          {isLoading ? (
            <span className="h-10 w-24 bg-indigo-800/40 animate-pulse rounded inline-block"></span>
          ) : (
            totalDiamonds.toLocaleString()
          )}
        </motion.span>
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full text-indigo-300 hover:text-indigo-100 hover:bg-indigo-700/30 mt-2" 
        onClick={() => navigate('/creator-rewards')}
      >
        Voir mes récompenses <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default DiamondsSection;
