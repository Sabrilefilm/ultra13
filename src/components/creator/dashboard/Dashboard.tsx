
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { WelcomeSection } from "./WelcomeSection";
import { DiamondsSection } from "./DiamondsSection";
import { LiveStatistics } from "./LiveStatistics";
import { SidebarContent } from "./SidebarContent";
import { DashboardTabs } from "./DashboardTabs";
import { UserGuide } from "@/components/help/UserGuide";
import { FounderMessage } from "@/components/dashboard/FounderMessage";
import useCreatorData from "./useCreatorData";

interface DashboardProps {
  role: string | null;
}

export const Dashboard = ({ role }: DashboardProps) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
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

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    
    setUserId(storedUserId);
    
    // Redirect if user is not a creator
    if (storedRole !== "creator") {
      navigate("/");
    }
    
    // Entrance animation
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // Calculate progress percentages
  const hoursProgress = Math.min(100, Math.round((weeklyHours / targetHours) * 100));
  const daysProgress = Math.min(100, Math.round((creatorData?.schedule?.days || 0) / targetDays * 100));
  
  if (isLoading || !creatorData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-900">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div 
      className={`max-w-6xl mx-auto space-y-6 transition-all duration-500 ${
        showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <FounderMessage className="mb-6" />
      
      <WelcomeSection 
        username={username} 
        totalDiamonds={totalDiamonds} 
        isLoading={isLoading} 
        onShowGuide={() => setShowGuide(!showGuide)} 
        showGuide={showGuide} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LiveStatistics 
          hoursProgress={hoursProgress}
          daysProgress={daysProgress}
          creatorData={creatorData}
          targetHours={targetHours}
          targetDays={targetDays}
        />
        
        <SidebarContent 
          totalDiamonds={totalDiamonds}
          nextMatch={creatorData.nextMatch}
          formatMatchDate={formatMatchDate}
          username={username}
        />
      </div>
      
      <DiamondsSection totalDiamonds={totalDiamonds} isLoading={isLoading} />
      
      <DashboardTabs 
        creatorData={creatorData}
        isLoading={isLoading}
        weeklyHours={weeklyHours}
        targetHours={targetHours}
        targetDays={targetDays}
        totalDiamonds={totalDiamonds}
      />
      
      {showGuide && (
        <div className="mt-6">
          <UserGuide />
        </div>
      )}
      
      <Footer role={role} version="2.0" className="pt-6" />
    </div>
  );
};

export default Dashboard;
