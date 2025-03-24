
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { UsernameWatermark } from "@/components/layout/UsernameWatermark";
import { Footer } from "@/components/layout/Footer";
import { useCreatorStats } from "@/hooks/creator-stats";

import { StatsHeader } from "@/components/creator-stats/StatsHeader";
import { StatsSummaryCards } from "@/components/creator-stats/StatsSummaryCards";
import { RewardsNotification } from "@/components/creator-stats/RewardsNotification";
import { CreatorsTable } from "@/components/creator-stats/CreatorsTable";
import { EditScheduleDialog } from "@/components/creator-stats/EditScheduleDialog";
import { EditDiamondsDialog } from "@/components/creator-stats/EditDiamondsDialog";
import { RemoveCreatorDialog } from "@/components/creator-stats/RemoveCreatorDialog";

const CreatorStats = () => {
  const { role, username, userId } = useIndexAuth();
  const isMobile = useIsMobile();
  const {
    creators,
    loading,
    selectedCreator,
    setSelectedCreator,
    isEditingSchedule,
    setIsEditingSchedule,
    hours,
    setHours,
    days,
    setDays,
    isEditingDiamonds,
    setIsEditingDiamonds,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    isSaving,
    removeDialogOpen,
    setRemoveDialogOpen,
    rewardThreshold,
    platformSettings,
    getTotalHours,
    getTotalDays,
    getTotalDiamonds,
    getCreatorsWithRewards,
    handleEditSchedule,
    handleSaveSchedule,
    handleEditDiamonds,
    handleSaveDiamonds,
    handleRemoveCreator,
    confirmRemoveCreator
  } = useCreatorStats(role, username);

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {username && <UsernameWatermark username={username} />}
      
      <UltraSidebar 
        username={username || ''}
        role={role || ''}
        onLogout={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
        currentPage="creator-stats"
      />
      
      <div className="flex-1 p-4 max-w-full md:max-w-6xl mx-auto space-y-6 overflow-x-auto">
        <StatsHeader />

        <StatsSummaryCards 
          totalHours={getTotalHours()}
          totalDays={getTotalDays()}
          totalDiamonds={getTotalDiamonds()}
        />

        <RewardsNotification 
          creatorsWithRewards={getCreatorsWithRewards()} 
          rewardThreshold={rewardThreshold} 
        />

        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle>Détails des Créateurs ({creators.length}) 📊</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <CreatorsTable 
              creators={creators}
              isMobile={isMobile}
              rewardThreshold={rewardThreshold}
              onEditSchedule={handleEditSchedule}
              onEditDiamonds={handleEditDiamonds}
              onRemoveCreator={handleRemoveCreator}
            />
          </CardContent>
        </Card>

        <EditScheduleDialog 
          isOpen={isEditingSchedule}
          onOpenChange={setIsEditingSchedule}
          creatorUsername={selectedCreator?.username}
          hours={hours}
          days={days}
          setHours={setHours}
          setDays={setDays}
          onSave={handleSaveSchedule}
        />

        <EditDiamondsDialog 
          isOpen={isEditingDiamonds}
          onOpenChange={setIsEditingDiamonds}
          creatorUsername={selectedCreator?.username}
          currentDiamonds={selectedCreator?.profiles?.[0]?.total_diamonds || 0}
          diamondAmount={diamondAmount}
          setDiamondAmount={setDiamondAmount}
          operationType={operationType}
          setOperationType={setOperationType}
          onSave={handleSaveDiamonds}
          isSaving={isSaving}
        />

        <RemoveCreatorDialog 
          isOpen={removeDialogOpen}
          onOpenChange={setRemoveDialogOpen}
          creatorUsername={selectedCreator?.username}
          onConfirm={confirmRemoveCreator}
        />
        
        <Footer role={role} version="1.3" />
      </div>
    </div>
  );
};

export default CreatorStats;
