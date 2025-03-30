
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserRound, 
  Bell, 
  Calendar, 
  AlertTriangle, 
  MessageSquare, 
  TrendingUp, 
  ShieldAlert,
  Users,
  BookOpen,
  Plus,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FounderDashboardProps {
  onCreateAccount: () => void;
  onConfigureRewards: () => void;
  onOpenLiveSchedule: (creatorId: string) => void;
  onScheduleMatch: () => void;
  onOpenSponsorships: () => void;
  onCreatePoster: () => void;
  username: string;
}

export const FounderDashboard: React.FC<FounderDashboardProps> = ({
  onCreateAccount,
  onConfigureRewards,
  onOpenLiveSchedule,
  onScheduleMatch,
  onOpenSponsorships,
  onCreatePoster,
  username
}) => {
  const navigate = useNavigate();
  
  const cards = [
    {
      title: "Gestion des Utilisateurs",
      icon: <UserRound className="w-5 h-5" />,
      action: () => navigate("/users"),
      buttonText: "Créer un compte",
      buttonAction: onCreateAccount,
      iconBgColor: "bg-purple-500/10"
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      action: () => navigate("/notifications"),
      buttonText: "Gérer les notifications",
      buttonAction: () => navigate("/notifications"),
      iconBgColor: "bg-blue-500/10"
    },
    {
      title: "Calendrier",
      icon: <Calendar className="w-5 h-5" />,
      action: () => onOpenLiveSchedule(username),
      buttonText: "Programmer un match",
      buttonAction: onScheduleMatch,
      iconBgColor: "bg-green-500/10"
    },
    {
      title: "Pénalités",
      icon: <AlertTriangle className="w-5 h-5" />,
      action: () => navigate("/penalties"),
      buttonText: "Gérer les pénalités",
      buttonAction: () => navigate("/penalties"),
      iconBgColor: "bg-red-500/10"
    },
    {
      title: "Messages",
      icon: <MessageSquare className="w-5 h-5" />,
      action: () => navigate("/messages"),
      buttonText: "Centre de messages",
      buttonAction: () => navigate("/messages"),
      iconBgColor: "bg-yellow-500/10"
    },
    {
      title: "Récompenses",
      icon: <TrendingUp className="w-5 h-5" />,
      action: onConfigureRewards,
      buttonText: "Configurer les récompenses",
      buttonAction: onConfigureRewards,
      iconBgColor: "bg-indigo-500/10"
    },
    {
      title: "Documents",
      icon: <ShieldAlert className="w-5 h-5" />,
      action: () => navigate("/documents"),
      buttonText: "Vérifier les documents",
      buttonAction: () => navigate("/documents"),
      iconBgColor: "bg-pink-500/10"
    },
    {
      title: "Transferts",
      icon: <Users className="w-5 h-5" />,
      action: () => navigate("/transfers"),
      buttonText: "Gérer les transferts",
      buttonAction: () => navigate("/transfers"),
      iconBgColor: "bg-orange-500/10"
    },
    {
      title: "Règles des créateurs",
      icon: <BookOpen className="w-5 h-5" />,
      action: () => navigate("/creator-rules"),
      buttonText: "Gérer les règles",
      buttonAction: () => navigate("/creator-rules"),
      iconBgColor: "bg-cyan-500/10"
    },
    {
      title: "Gestion d'Agence",
      icon: <UserCheck className="w-5 h-5" />,
      action: () => navigate("/agency-assignment"),
      buttonText: "Gérer les assignations",
      buttonAction: () => navigate("/agency-assignment"),
      iconBgColor: "bg-amber-500/10"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="bg-[#1e1f2e]/90 backdrop-blur-sm border border-gray-800/50 rounded-xl p-4 space-y-8 shadow-lg relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 ${card.iconBgColor} rounded-full -mr-10 -mt-10 blur-xl`}></div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">{card.title}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={card.action} 
                className="bg-white/10 hover:bg-white/20"
              >
                {card.icon}
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-white/10 hover:bg-white/10" 
              onClick={card.buttonAction}
            >
              {card.title === "Gestion des Utilisateurs" && <Plus className="mr-2 h-4 w-4" />}
              {card.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
