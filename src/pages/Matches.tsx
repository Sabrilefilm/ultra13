
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Plus } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { useNavigate } from "react-router-dom";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { useUpcomingMatches } from "@/hooks/use-upcoming-matches";
import { UpcomingMatches } from "@/components/dashboard/UpcomingMatches";
import { ScheduleMatchDialog } from "@/components/matches/ScheduleMatchDialog";
import { MatchCalendar } from "@/components/dashboard/MatchCalendar"; 
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { useToast } from "@/hooks/use-toast";

const Matches = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, username, role, handleLogout } = useIndexAuth();
  const { matches, isLoading } = useUpcomingMatches(role || '', username || '');
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  
  // Inactivity timer for automatic logout
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000, 
    onWarning: () => {}
  });

  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }
  
  const canScheduleMatch = ['agent', 'manager', 'founder'].includes(role || '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar 
        username={username || ''}
        role={role || ''}
        onLogout={handleLogout}
        currentPage="matches"
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Matchs TikTok</h1>
          </div>
          
          {canScheduleMatch && (
            <Button
              onClick={() => setIsMatchDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Programmer un match
            </Button>
          )}
        </div>
        
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {isLoading ? (
            <Loading size="large" text="Chargement des matchs..." />
          ) : (
            <div className="max-w-7xl mx-auto space-y-6">
              <MatchCalendar 
                matches={matches || []} 
                role={role || ''} 
                isLoading={isLoading}
                creatorId={username || ''}
              />
              
              <UpcomingMatches 
                role={role || ''} 
                creatorId={username || ''} 
              />
            </div>
          )}
        </div>
      </div>
      
      {canScheduleMatch && (
        <ScheduleMatchDialog
          isOpen={isMatchDialogOpen}
          onClose={() => setIsMatchDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Matches;
