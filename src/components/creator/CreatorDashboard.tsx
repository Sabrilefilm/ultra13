
import React, { useState } from "react";
import { StatCards } from "@/components/dashboard/StatCards";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserGuide } from "@/components/help/UserGuide";
import { BarChart4 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { FounderMessage } from "@/components/dashboard/FounderMessage";

// Import refactored components
import { WelcomeSection } from "./dashboard/WelcomeSection";
import { CreatorSchedule } from "./dashboard/CreatorSchedule";
import { DiamondsSection } from "./dashboard/DiamondsSection";
import { NextMatchSection } from "./dashboard/NextMatchSection";
import { UpdatesInfo } from "./dashboard/UpdatesInfo";
import { TrophyIcon } from "./dashboard/Trophy";
import { LeaveAgencyButton } from "./dashboard/LeaveAgencyButton";
import { useCreatorData } from "./dashboard/useCreatorData";

interface CreatorDashboardProps {
  onOpenSponsorshipForm: () => void;
  onOpenSponsorshipList: () => void;
  onCreatePoster: () => void;
  role: string;
}

export const CreatorDashboard = ({
  onOpenSponsorshipForm,
  onOpenSponsorshipList,
  onCreatePoster,
  role
}: CreatorDashboardProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showGuide, setShowGuide] = useState(false);
  
  const {
    creatorData,
    isLoading,
    totalDiamonds,
    username,
    weeklyHours,
    targetHours,
    targetDays,
    formatMatchDate
  } = useCreatorData();

  return (
    <div className="space-y-6">
      <DailyQuote />
      
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-900/20 rounded-xl shadow-md hover:shadow-lg transition-all">
        <CardHeader className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-t-xl border-b border-purple-900/10">
          <CardTitle className="text-xl text-white/90 flex items-center gap-2">
            <BarChart4 className="h-5 w-5 text-purple-400" />
            Tableau de bord
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-gray-300 space-y-6">
            <FounderMessage className="mb-6" />
            
            <div className="flex gap-4 flex-col md:flex-row">
              <WelcomeSection 
                username={username}
                totalDiamonds={totalDiamonds}
                isLoading={isLoading}
                onShowGuide={() => setShowGuide(!showGuide)}
                showGuide={showGuide}
              />
              
              <div className="md:w-1/3 md:border-l border-purple-900/30 md:pl-4">
                <CreatorSchedule 
                  isLoading={isLoading}
                  hours={creatorData?.schedule?.hours || 0}
                  days={creatorData?.schedule?.days || 0}
                  weeklyHours={weeklyHours}
                  targetHours={targetHours}
                  targetDays={targetDays}
                />
                
                <DiamondsSection 
                  totalDiamonds={totalDiamonds}
                  isLoading={isLoading}
                />
              </div>
            </div>
            
            <NextMatchSection 
              nextMatch={creatorData?.nextMatch}
              username={username}
              formatMatchDate={formatMatchDate}
            />
          </div>
          
          <UpdatesInfo />
          
        </CardContent>
      </Card>
      
      <StatCards 
        role={role} 
        onOpenSponsorshipForm={onOpenSponsorshipForm} 
        onOpenSponsorshipList={onOpenSponsorshipList} 
        onCreatePoster={onCreatePoster} 
      />
      
      {showGuide && (
        <div className="mt-6">
          <UserGuide />
        </div>
      )}
      
      <LeaveAgencyButton />
    </div>
  );
};
