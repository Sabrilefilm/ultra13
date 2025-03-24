
import React from "react";
import { UserCheck, Star, Diamond, BookOpen, MessageSquare, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface WelcomeSectionProps {
  username: string;
  totalDiamonds: number;
  isLoading: boolean;
  onShowGuide: () => void;
  showGuide: boolean;
}

export const WelcomeSection = ({
  username,
  totalDiamonds,
  isLoading,
  onShowGuide,
  showGuide
}: WelcomeSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="md:w-2/3">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-400" />
        Bienvenue {username} sur votre tableau de bord! ✨
      </h3>
      
      <p className="text-gray-400 mb-4">
        Retrouvez ici toutes les informations importantes concernant vos performances, vos objectifs et vos prochains matchs.
      </p>
      
      <motion.div 
        initial={{opacity: 0, y: 10}} 
        animate={{opacity: 1, y: 0}} 
        transition={{delay: 0.3}}
        className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-lg border border-purple-800/30 p-4 mb-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <UserCheck className="h-5 w-5 text-green-400" />
          <h4 className="font-medium text-green-300">Créateur performant</h4>
        </div>
        <p className="text-gray-400 text-sm">
          En tant qu'utilisateur performant, vous avez accès à des fonctionnalités exclusives et des récompenses supplémentaires.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-green-300">Avantages exclusifs</span>
          </div>
          <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-2 flex items-center gap-2">
            <Diamond className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-green-300">Bonus de diamants</span>
          </div>
        </div>
      </motion.div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          onClick={() => navigate('/messages')} 
          variant="outline" 
          className="bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border-indigo-700/50 hover:border-indigo-600 flex gap-2 items-center"
        >
          <MessageSquare className="h-4 w-4" />
          Messagerie 💬
        </Button>
        
        <Button 
          onClick={() => navigate('/creator-rewards')} 
          variant="outline" 
          className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border-purple-700/50 hover:border-purple-600 flex gap-2 items-center"
        >
          <Diamond className="h-4 w-4" />
          Mes Diamants 💎
        </Button>
        
        <Button 
          onClick={() => navigate('/training')} 
          variant="outline" 
          className="bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border-blue-700/50 hover:border-blue-600 flex gap-2 items-center"
        >
          <BookOpen className="h-4 w-4" />
          Formations 📚
        </Button>
        
        <Button 
          onClick={onShowGuide} 
          variant="outline" 
          className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border-purple-700/50 hover:border-purple-600 flex gap-2 items-center"
        >
          {showGuide ? "Masquer le guide" : "Voir le guide d'utilisation 📖"}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeSection;
