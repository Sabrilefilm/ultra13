
import React from "react";
import { SidebarUserProfileProps } from "./types";

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ 
  username, 
  role,
  collapsed 
}) => {
  return (
    <div className={`flex items-center ${collapsed ? "flex-col justify-center" : "justify-start"} px-4 py-3 border-b border-slate-700/50`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center animate-pulse">
        {username.charAt(0).toUpperCase()}
      </div>
      {!collapsed && (
        <div className="ml-3 flex flex-col overflow-hidden">
          <p className="text-sm font-medium text-white truncate">{username}</p>
          <p className="text-xs text-slate-400">{role}</p>
        </div>
      )}
    </div>
  );
};
