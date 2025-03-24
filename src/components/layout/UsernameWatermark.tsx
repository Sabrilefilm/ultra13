
import React from 'react';

interface UsernameWatermarkProps {
  username: string;
}

export const UsernameWatermark: React.FC<UsernameWatermarkProps> = ({ username }) => {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {Array.from({ length: 500 }).map((_, index) => (
        <div 
          key={index} 
          className="absolute text-[8px] font-bold text-slate-200/10" 
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          {username.toUpperCase()}
        </div>
      ))}
    </div>
  );
};
