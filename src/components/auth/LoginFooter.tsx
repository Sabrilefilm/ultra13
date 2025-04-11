
import React from 'react';

export const LoginFooter: React.FC = () => {
  return (
    <div className="px-6 py-4 bg-slate-800/20 border-t border-slate-800/50 text-center">
      <p className="text-xs text-slate-400">
        &copy; {new Date().getFullYear()} ULTRA - Tous droits réservés
      </p>
      <p className="text-xs text-slate-500 mt-1">
        Version 1.0
      </p>
    </div>
  );
};
