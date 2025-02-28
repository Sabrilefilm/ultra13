
import { useState, useEffect, useCallback } from 'react';

const SESSION_TIMEOUT = 120000; // 2 minutes en millisecondes
const WARNING_TIME = 30000; // 30 secondes avant expiration

export const useSessionTimeout = (isAuthenticated: boolean) => {
  const [timeRemaining, setTimeRemaining] = useState(WARNING_TIME);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  // Réinitialiser le timer
  const resetTimeout = useCallback(() => {
    if (!isAuthenticated) return;

    // Effacer les timers existants
    if (timer) clearTimeout(timer);
    if (warningTimer) clearTimeout(warningTimer);
    
    // Réinitialiser l'avertissement
    setShowWarning(false);
    
    // Démarrer un nouveau timer pour l'avertissement
    const newWarningTimer = setTimeout(() => {
      setShowWarning(true);
      
      // Démarrer le décompte
      const countdown = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      
      setWarningTimer(countdown as unknown as NodeJS.Timeout);
      
    }, SESSION_TIMEOUT - WARNING_TIME);
    
    // Démarrer un nouveau timer pour la déconnexion
    const newTimer = setTimeout(() => {
      localStorage.clear();
      window.location.href = '/';
    }, SESSION_TIMEOUT);
    
    setTimer(newTimer);
    setWarningTimer(newWarningTimer);
  }, [isAuthenticated]);

  // Gérer la déconnexion
  const handleLogoutTimeout = useCallback(() => {
    if (timer) clearTimeout(timer);
    if (warningTimer) clearTimeout(warningTimer);
    localStorage.clear();
    window.location.href = '/';
  }, [timer, warningTimer]);

  // Gérer le maintien de la connexion
  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    setTimeRemaining(WARNING_TIME);
    resetTimeout();
  }, [resetTimeout]);

  // Mettre en place le timer initial
  useEffect(() => {
    if (isAuthenticated) {
      resetTimeout();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [isAuthenticated, resetTimeout]);

  return { 
    timeRemaining,
    resetTimeout,
    showWarning,
    handleStayLoggedIn,
    handleLogoutTimeout
  };
};
