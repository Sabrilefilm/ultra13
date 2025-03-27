
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogoutButton } from "./LogoutButton";

interface HeaderProps {
  role?: string;
  username?: string;
  onLogout?: () => void;
}

export const Header = ({ role, username, onLogout }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-md py-2 shadow-lg"
        : "bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-white/10 py-3"
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Rocket className={`h-6 w-6 text-purple-400 transition-transform duration-300 ${
              scrolled ? "group-hover:rotate-12" : ""
            }`} />
            <div className="absolute inset-0 bg-purple-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent relative z-10">
              AGENCY PHOCÉEN
              <span className="absolute -inset-1 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-lg -z-10"></span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {role && username && (
            <div className={`transition-all duration-300 ${
              scrolled 
                ? "text-sm text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full"
                : "text-sm text-white/60"
            }`}>
              Connecté en tant que <span className="text-white font-medium">{username}</span>
              {role && <span className="ml-1 text-purple-400">({role})</span>}
            </div>
          )}
          
          {onLogout && (
            <LogoutButton 
              onLogout={onLogout} 
              username={username}
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};
