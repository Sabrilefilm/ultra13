
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Award, Star } from "lucide-react";

interface ProfileHeaderProps {
  username: string | null;
  role: string | null;
  avatarUrl?: string;
  lastActive?: string;
  daysActive?: number;
}

export function ProfileHeader({ username, role, avatarUrl, lastActive, daysActive = 0 }: ProfileHeaderProps) {
  const initials = username ? username.slice(0, 2).toUpperCase() : "U";

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="flex-shrink-0 flex flex-col items-center">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarUrl || ""} />
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white text-3xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="mt-2">
          <Badge variant="outline" className="bg-amber-600/20 text-amber-400 border-amber-500/30">
            {role || "Utilisateur"}
          </Badge>
        </div>
      </div>
      
      <div className="flex-grow text-center md:text-left">
        <h2 className="text-2xl font-bold text-white">{username || "Utilisateur"}</h2>
        <p className="text-slate-400 text-sm mt-1">@{username?.toLowerCase() || "username"}</p>
        
        <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
          {lastActive && (
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-full">
              <CalendarDays className="h-4 w-4 text-blue-400" />
              <span className="text-sm">Dernière activité: {lastActive}</span>
            </div>
          )}
          
          {daysActive > 0 && (
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-full">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-sm">{daysActive} jours actifs</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-emerald-400" />
            <span className="text-sm">Bronze</span>
          </div>
        </div>
      </div>
    </div>
  );
}
