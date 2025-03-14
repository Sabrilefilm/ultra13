
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  UserRound, 
  Plus, 
  CalendarDays, 
  TrendingUp, 
  Bell, 
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  Users,
  BookOpen
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
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-4 space-y-8 shadow-lg border-white/10 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Gestion des Utilisateurs</h3>
          <Button variant="ghost" size="icon" onClick={() => navigate("/users")} className="bg-white/10 hover:bg-white/20">
            <UserRound className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={onCreateAccount}>
          <Plus className="mr-2 h-4 w-4" />
          Créer un compte
        </Button>
      </Card>

      <Card className="p-4 space-y-8 shadow-lg border-white/10 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Notifications</h3>
          <Button variant="ghost" size="icon" onClick={() => navigate("/notifications")} className="bg-white/10 hover:bg-white/20">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={() => navigate("/notifications")}>
          Gérer les notifications
        </Button>
      </Card>

      <Card className="p-4 space-y-8 shadow-lg border-white/10 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Calendrier</h3>
          <Button variant="ghost" size="icon" onClick={() => onOpenLiveSchedule(username)} className="bg-white/10 hover:bg-white/20">
            <CalendarDays className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={() => onScheduleMatch()}>
          Programmer un match
        </Button>
      </Card>

      <Card className="p-4 space-y-8 shadow-lg border-white/10 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Pénalités</h3>
          <Button variant="ghost" size="icon" onClick={() => navigate("/penalties")} className="bg-white/10 hover:bg-white/20">
            <AlertTriangle className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={() => navigate("/penalties")}>
          Gérer les pénalités
        </Button>
      </Card>

      <Card className="p-4 space-y-8 shadow-lg border-white/10 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Messages</h3>
          <Button variant="ghost" size="icon" onClick={() => navigate("/messages")} className="bg-white/10 hover:bg-white/20">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={() => navigate("/messages")}>
          Centre de messages
        </Button>
      </Card>

      <Card className="p-4 space-y-8 shadow-lg border-white/10 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Récompenses</h3>
          <Button variant="ghost" size="icon" onClick={onConfigureRewards} className="bg-white/10 hover:bg-white/20">
            <TrendingUp className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={onConfigureRewards}>
          Configurer les récompenses
        </Button>
      </Card>

      <Card className="p-4 space-y-8 shadow-lg border-white/10 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Documents</h3>
          <Button variant="ghost" size="icon" onClick={() => navigate("/documents")} className="bg-white/10 hover:bg-white/20">
            <ShieldAlert className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={() => navigate("/documents")}>
          Vérifier les documents
        </Button>
      </Card>

      <Card className="p-4 space-y-8 shadow-lg border-white/10 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Transferts</h3>
          <Button variant="ghost" size="icon" onClick={() => navigate("/transfers")} className="bg-white/10 hover:bg-white/20">
            <Users className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={() => navigate("/transfers")}>
          Gérer les transferts
        </Button>
      </Card>

      <Card className="p-4 space-y-8 shadow-lg border-white/10 bg-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Règles des créateurs</h3>
          <Button variant="ghost" size="icon" onClick={() => navigate("/creator-rules")} className="bg-white/10 hover:bg-white/20">
            <BookOpen className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" onClick={() => navigate("/creator-rules")}>
          Gérer les règles
        </Button>
      </Card>
    </div>;
};
