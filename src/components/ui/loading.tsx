
import React from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  text?: string;
  fullScreen?: boolean;
}

export const Loading = ({ 
  size = "medium", 
  text = "Chargement en cours...",
  fullScreen = false 
}: LoadingProps) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-24 h-24"
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <div className={`relative ${sizeClasses[size]}`}>
          {/* Outer circle */}
          <div className={`absolute inset-0 rounded-full border-4 border-purple-300/30 dark:border-purple-700/30 ${sizeClasses[size]}`}></div>
          
          {/* Spinning circle */}
          <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 animate-spin ${sizeClasses[size]}`}></div>
          
          {/* Inner gradient glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 animate-pulse ${size === "small" ? "w-4 h-4" : size === "large" ? "w-12 h-12" : "w-8 h-8"}`}></div>
          </div>
        </div>
        
        {text && (
          <p className="text-center text-purple-700 dark:text-purple-400 font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};
