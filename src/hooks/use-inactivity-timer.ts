
import { useState, useEffect, useCallback } from "react";

interface UseInactivityTimerProps {
  timeout: number; // en millisecondes
  onTimeout: () => void;
  warningTime: number; // en millisecondes avant timeout
  onWarning: () => void;
}

export const useInactivityTimer = ({
  timeout,
  onTimeout,
  warningTime,
  onWarning,
}: UseInactivityTimerProps) => {
  const [timer, setTimer] = useState<number | null>(null);
  const [warningTimer, setWarningTimer] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(timeout);
  const [showWarning, setShowWarning] = useState(false);

  const resetTimer = useCallback(() => {
    setRemainingTime(timeout);
    setShowWarning(false);
    
    if (timer) window.clearTimeout(timer);
    if (warningTimer) window.clearTimeout(warningTimer);
    
    // Configurer le timer d'avertissement
    const newWarningTimer = window.setTimeout(() => {
      setShowWarning(true);
      onWarning();
    }, timeout - warningTime);
    
    // Configurer le timer de déconnexion
    const newTimer = window.setTimeout(() => {
      onTimeout();
    }, timeout);
    
    setTimer(newTimer);
    setWarningTimer(newWarningTimer);
  }, [timeout, warningTime, onTimeout, onWarning, timer, warningTimer]);

  // Mettre à jour le temps restant
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) return 0;
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Configurer les écouteurs d'événements pour réinitialiser le timer
  useEffect(() => {
    // Événements qui réinitialisent le timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Ajouter tous les écouteurs
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    // Initialiser le timer
    resetTimer();
    
    // Nettoyer
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      
      if (timer) window.clearTimeout(timer);
      if (warningTimer) window.clearTimeout(warningTimer);
    };
  }, [resetTimer, timer, warningTimer]);

  const dismissWarning = () => {
    setShowWarning(false);
    resetTimer();
  };

  return {
    remainingTime,
    showWarning,
    dismissWarning,
    formattedTime: formatTime(remainingTime),
  };
};

// Formatter le temps en minutes:secondes
const formatTime = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
