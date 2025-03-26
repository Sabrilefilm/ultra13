
import React from "react";
import { AchievementSection } from "./AchievementSection";
import { NextMatchSection } from "./NextMatchSection";
import { UpdatesInfo } from "./UpdatesInfo";

interface SidebarContentProps {
  totalDiamonds: number;
  nextMatch: any;
  formatMatchDate: (date: string) => string;
  username: string;
}

export const SidebarContent = ({
  totalDiamonds,
  nextMatch,
  formatMatchDate,
  username
}: SidebarContentProps) => {
  return (
    <div className="col-span-1 space-y-6">
      <AchievementSection totalDiamonds={totalDiamonds} />
      
      <NextMatchSection 
        nextMatch={nextMatch} 
        formatMatchDate={formatMatchDate}
        username={username} 
      />
      
      <UpdatesInfo />
    </div>
  );
};

export default SidebarContent;
