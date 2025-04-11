
import React from 'react';

export const LoginBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-slate-900 opacity-80" />
      
      {/* Floating particles */}
      {Array(15).fill(0).map((_, i) => (
        <div 
          key={i} 
          className="absolute w-1 h-1 rounded-full bg-purple-300/20 dark:bg-purple-500/20 animate-ping-slow" 
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} 
        />
      ))}
      
      {/* Light beams */}
      <div className="absolute top-0 left-1/4 w-1/3 h-1/3 bg-blue-500/10 rounded-full filter blur-[100px] animate-pulse" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-purple-500/10 rounded-full filter blur-[100px] animate-pulse" 
           style={{ animationDuration: '12s' }} />
    </div>
  );
};
