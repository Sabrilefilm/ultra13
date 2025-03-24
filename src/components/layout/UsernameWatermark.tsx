
import React from 'react';

interface UsernameWatermarkProps {
  username: string;
}

export const UsernameWatermark: React.FC<UsernameWatermarkProps> = ({ username }) => {
  // Générer les positions statiques une seule fois
  const watermarkPositions = React.useMemo(() => {
    return Array.from({ length: 500 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {watermarkPositions.map((position, index) => (
        <div 
          key={index} 
          className="absolute text-[8px] font-bold text-slate-200/10" 
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {username.toUpperCase()}
        </div>
      ))}
    </div>
  );
};
