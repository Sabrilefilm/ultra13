
import React from 'react';

export const LoginHeader: React.FC = () => {
  return (
    <div className="p-6 border-b border-slate-800/50 bg-slate-800/30">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-4">
          <div className="text-white font-bold text-xl">U</div>
        </div>
        <h1 className="text-2xl font-bold text-white">ULTRA</h1>
        <p className="text-slate-400 text-sm mt-1">Plateforme de gestion d'agence</p>
      </div>
    </div>
  );
};
