
import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NextMatchSectionProps {
  nextMatch: any;
  username: string;
  formatMatchDate: (date: string) => string;
}

export const NextMatchSection = ({ nextMatch, username, formatMatchDate }: NextMatchSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-4 bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-5 w-5 text-indigo-400" />
        <div>
          <p className="text-indigo-300 font-medium">Prochain match prévu 🎮</p>
          {nextMatch ? (
            <>
              <p className="text-indigo-400/80 text-sm">{formatMatchDate(nextMatch.match_date)}</p>
              <div className="flex items-center gap-2 mt-1">
                <motion.span 
                  className="bg-indigo-900/30 border border-indigo-700/30 rounded-full px-3 py-1 text-indigo-300 font-medium" 
                  whileHover={{ scale: 1.05 }}
                >
                  {username}
                </motion.span>
                <span className="text-indigo-400 mx-2">vs</span>
                <motion.span 
                  className="bg-indigo-900/30 border border-indigo-700/30 rounded-full px-3 py-1 text-indigo-300 font-medium" 
                  whileHover={{ scale: 1.05 }}
                >
                  {nextMatch.opponent_id}
                </motion.span>
              </div>
            </>
          ) : (
            <p className="text-indigo-400/80 text-sm">Aucun match programmé pour le moment</p>
          )}
        </div>
      </div>
      <Button 
        variant="ghost" 
        className="w-full mt-2 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-700/30" 
        onClick={() => navigate('/matches')}
      >
        Voir tous mes matchs <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default NextMatchSection;
