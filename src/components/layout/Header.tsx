
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  role?: string;
  username?: string;
}

export const Header = ({ role, username }: HeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-white/10 mb-6">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-purple-400" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">AGENCY PHOCÉEN</h1>
          </div>
        </div>
        
        {role && username && (
          <div className="text-sm text-white/60">
            Connecté en tant que <span className="text-white font-medium">{username}</span>
            {role && <span className="ml-1 text-purple-400">({role})</span>}
          </div>
        )}
      </div>
    </div>
  );
};
