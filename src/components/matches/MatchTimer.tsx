
import React, { useState, useEffect } from 'react';
import { Timer } from "lucide-react";

interface MatchTimerProps {
  isRunning: boolean;
  onFinish?: () => void;
  initialMinutes?: number;
}

export const MatchTimer: React.FC<MatchTimerProps> = ({ 
  isRunning, 
  onFinish,
  initialMinutes = 8 // Durée par défaut de 8 minutes
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timerId: number | null = null;
    
    if (isRunning && !isPaused && secondsLeft > 0) {
      timerId = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            if (onFinish) onFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId !== null) clearInterval(timerId);
    };
  }, [isRunning, isPaused, secondsLeft, onFinish]);
  
  // Formater les secondes en format MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculer le pourcentage restant pour la barre de progression
  const percentageLeft = (secondsLeft / (initialMinutes * 60)) * 100;
  
  // Déterminer la couleur de la barre de progression en fonction du temps restant
  const getColorClass = () => {
    if (percentageLeft > 50) return "bg-green-500 dark:bg-green-600";
    if (percentageLeft > 25) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-red-500 dark:bg-red-600";
  };

  return (
    <div className="timer-wrapper">
      <div className="flex items-center space-x-2">
        <Timer className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span className="font-mono text-lg font-semibold text-purple-800 dark:text-purple-300">
          {formatTime(secondsLeft)}
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${getColorClass()}`} 
          style={{ width: `${percentageLeft}%` }}
        />
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="text-xs px-2 py-1 rounded bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/50 transition-colors"
        >
          {isPaused ? 'Reprendre' : 'Pause'}
        </button>
        <button 
          onClick={() => setSecondsLeft(initialMinutes * 60)}
          className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50 transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};
