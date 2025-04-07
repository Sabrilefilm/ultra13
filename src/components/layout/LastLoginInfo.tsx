
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

interface LastLoginInfoProps {
  lastLogin: string | null;
  username: string;
}

export const LastLoginInfo: React.FC<LastLoginInfoProps> = ({ lastLogin, username }) => {
  if (!lastLogin) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Format date: "1 janvier 2023 à 14:30"
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Date inconnue";
    }
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700/50 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-indigo-400" />
          <div>
            <p className="text-sm text-slate-300">
              <span className="font-medium text-white">{username}</span> - Dernière connexion :
            </p>
            <p className="text-sm text-indigo-300 font-medium">{formatDate(lastLogin)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
