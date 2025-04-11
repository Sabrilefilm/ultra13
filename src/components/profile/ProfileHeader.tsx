
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
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-neo-glow">
      <div className="flex-shrink-0 flex flex-col items-center">
        <Avatar className="w-24 h-24 border-2 border-purple-500/30 shadow-neo-glow">
          <AvatarImage src={avatarUrl || ""} />
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-700 text-white text-3xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="mt-2">
          <Badge variant="glass" className="shadow-sm">
            {role || "Utilisateur"}
          </Badge>
        </div>
      </div>
      
      <div className="flex-grow text-center md:text-left">
        <h2 className="text-2xl font-bold text-white">{username || "Utilisateur"}</h2>
        <p className="text-slate-400 text-sm mt-1">@{username?.toLowerCase() || "username"}</p>
        
        <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
          {lastActive && (
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              <CalendarDays className="h-4 w-4 text-blue-400" />
              <span className="text-sm">Dernière activité: {lastActive}</span>
            </div>
          )}
          
          {daysActive > 0 && (
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-sm">{daysActive} jours actifs</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
            <Star className="h-4 w-4 text-emerald-400" />
            <span className="text-sm">Bronze</span>
          </div>
        </div>
      </div>
    </div>
  );
}
