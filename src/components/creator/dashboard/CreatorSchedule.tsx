
import React from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface CreatorScheduleProps {
  isLoading: boolean;
  hours: number;
  days: number;
  weeklyHours: number;
  targetHours: number;
  targetDays: number;
}

export const CreatorSchedule = ({
  isLoading,
  hours,
  days,
  weeklyHours,
  targetHours,
  targetDays
}: CreatorScheduleProps) => {
  return (
    <div className="p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-purple-300 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Vos horaires ⏰
        </h4>
        <div className="px-2 py-1 bg-purple-800/30 border border-purple-700/30 rounded-md text-xs text-purple-300">
          Planning
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-purple-800/20 border border-purple-700/20 rounded-md p-2 text-center">
          <span className="block text-2xl font-bold text-purple-300">
            {isLoading ? <span className="h-8 w-16 bg-purple-800/40 animate-pulse rounded inline-block"></span> : hours || 0}
          </span>
          <span className="text-xs text-purple-200/70">heures/jour</span>
        </div>
        <div className="bg-purple-800/20 border border-purple-700/20 rounded-md p-2 text-center">
          <span className="block text-2xl font-bold text-purple-300">
            {isLoading ? <span className="h-8 w-16 bg-purple-800/40 animate-pulse rounded inline-block"></span> : days || 0}
          </span>
          <span className="text-xs text-purple-200/70">jours/semaine</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-purple-300">Total hebdomadaire:</span>
        <span className="text-lg font-semibold text-purple-300">{weeklyHours}h</span>
      </div>
      
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-purple-300">Objectif:</span>
        <span className="text-sm text-purple-300">{targetHours}h ({targetDays}j)</span>
      </div>
      
      <div className="mt-2 pt-2 border-t border-purple-800/30">
        <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
          <motion.div 
            initial={{width: 0}} 
            animate={{width: `${Math.min(100, weeklyHours / targetHours * 100)}%`}} 
            transition={{duration: 1, ease: "easeOut"}} 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
          ></motion.div>
        </div>
        <div className="text-right text-xs text-purple-400 mt-1">
          {Math.round(weeklyHours / targetHours * 100)}% de l'objectif
        </div>
      </div>
    </div>
  );
};

export default CreatorSchedule;
