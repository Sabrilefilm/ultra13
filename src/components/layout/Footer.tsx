
import React from "react";

interface FooterProps {
  role?: string;
  version?: string;
  className?: string; // Added className prop
}

export const Footer = ({ role, version = "1.0", className = "" }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`mt-8 mb-4 text-center text-sm text-gray-400 dark:text-gray-600 ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2">
        <p>© {currentYear} Agency Dashboard</p>
        <span className="hidden md:inline">•</span>
        <p>Tous droits réservés</p>
        <span className="hidden md:inline">•</span>
        <p className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs">
          Version {version} 🚀
        </p>
        {role === 'founder' && (
          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs">
            Mode Fondateur 👑
          </span>
        )}
      </div>
    </footer>
  );
};
