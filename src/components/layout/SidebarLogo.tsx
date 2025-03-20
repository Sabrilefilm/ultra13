
import { Rocket } from "lucide-react";

interface SidebarLogoProps {
  collapsed?: boolean;
}

export const SidebarLogo = ({ collapsed = false }: SidebarLogoProps) => {
  return (
    <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
      <div className="relative">
        <Rocket className="h-8 w-8 text-purple-500 animate-pulse" />
        <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-xl opacity-30 animate-ping"></div>
      </div>
      
      {!collapsed && (
        <div className="ml-3 flex flex-col">
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent neon-text">
            ULTRA
          </span>
          <span className="text-xs text-slate-400">by Agence Phocéen</span>
        </div>
      )}
    </div>
  );
};
