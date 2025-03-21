
import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check if user has a preference stored
    const storedTheme = localStorage.getItem('vite-ui-theme');
    
    // Default to dark mode if no preference is found
    setIsDarkMode(storedTheme ? storedTheme === 'dark' : true);
    
    // Listen for theme changes
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem('vite-ui-theme');
      setIsDarkMode(currentTheme === 'dark');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { isDarkMode };
};
