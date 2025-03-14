
import { useState, useEffect, useCallback } from "react";

interface InactivityTimerProps {
  timeout: number;
  onTimeout: () => void;
  warningTime: number;
  onWarning?: () => void;
}

export const useInactivityTimer = ({
  timeout,
  onTimeout,
  warningTime,
  onWarning
}: InactivityTimerProps) => {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(warningTime / 1000);
  const [formattedTime, setFormattedTime] = useState("00:30");

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  const dismissWarning = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleActivity = () => resetTimer();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivity;
      
      if (elapsed >= timeout) {
        onTimeout();
        resetTimer();
      } else if (elapsed >= timeout - warningTime) {
        if (!showWarning) {
          setShowWarning(true);
          if (onWarning) onWarning();
        }
        
        // Calculate remaining time
        const remaining = Math.max(0, (timeout - elapsed) / 1000);
        setTimeRemaining(remaining);
        setFormattedTime(formatTime(remaining));
      }
    }, 1000);

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [lastActivity, timeout, warningTime, onTimeout, onWarning, resetTimer, showWarning]);

  return {
    showWarning,
    dismissWarning,
    timeRemaining,
    formattedTime
  };
};
