
import { useState, useEffect, useCallback, useRef } from "react";

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
  const [remainingTime, setRemainingTime] = useState<number>(timeout);
  const [showWarning, setShowWarning] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const warningTimerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    setRemainingTime(timeout);
    setShowWarning(false);
    
    // Nettoyer les timers existants
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (warningTimerRef.current) window.clearTimeout(warningTimerRef.current);
    
    // Configurer le timer d'avertissement
    warningTimerRef.current = window.setTimeout(() => {
      setShowWarning(true);
      onWarning();
    }, timeout - warningTime);
    
    // Configurer le timer de déconnexion
    timerRef.current = window.setTimeout(() => {
      onTimeout();
    }, timeout);
  }, [timeout, warningTime, onTimeout, onWarning]);

  // Mettre à jour le temps restant
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = window.setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) return 0;
        return prev - 1000;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Configurer les écouteurs d'événements pour réinitialiser le timer
  useEffect(() => {
    // Événements qui réinitialisent le timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Fonction wrapper pour limiter le taux de réinitialisation
    let lastResetTime = Date.now();
    const throttledReset = () => {
      const now = Date.now();
      if (now - lastResetTime > 1000) { // Limiter à une fois par seconde
        lastResetTime = now;
        resetTimer();
      }
    };
    
    // Ajouter tous les écouteurs
    events.forEach(event => {
      window.addEventListener(event, throttledReset);
    });
    
    // Initialiser le timer
    resetTimer();
    
    // Nettoyer
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, throttledReset);
      });
      
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (warningTimerRef.current) window.clearTimeout(warningTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer]);

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
    resetTimer();
  }, [resetTimer]);

  // Formatter le temps en minutes:secondes
  const formattedTime = formatTime(showWarning ? (timeout - (timeout - warningTime)) : remainingTime);

  return {
    remainingTime,
    showWarning,
    dismissWarning,
    formattedTime,
  };
};

// Formatter le temps en minutes:secondes
const formatTime = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
