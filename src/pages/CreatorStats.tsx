
import React, { useEffect, useState } from "react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useCreatorsData } from "@/hooks/creator-stats/use-creators-data";
import { CreatorsTable } from "@/components/creator-stats/CreatorsTable";
import { SearchBar } from "@/components/accounts/SearchBar";
import { StatsHeader } from "@/components/creator-stats/StatsHeader";
import { StatsSummaryCards } from "@/components/creator-stats/StatsSummaryCards";
import { ResetActionsCard } from "@/components/creator-stats/ResetActionsCard";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const pageSize = 10;

const CreatorStats = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [viewType, setViewType] = useState<"all" | "week" | "month">("all");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const {
    creators,
    isLoading,
    totalCreators,
    totalActiveCreators,
    resetAllSchedules,
    resetAllDiamonds,
    handleRemoveCreator,
    handleEditSchedule,
    handleEditDiamonds,
    fetchCreators
  } = useCreatorsData(currentPage, pageSize, search, viewType);
  
  useEffect(() => {
    if (!isAuthenticated || !["founder", "manager", "agent"].includes(role || "")) {
      window.location.href = '/';
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    // Force refresh when component mounts
    fetchCreators();
    console.log("CreatorStats mounted - forcing refresh");
  }, []);

  const handleRefetch = () => {
    fetchCreators();
    toast("Données actualisées");
  };

  if (!isAuthenticated) {
    return null;
  }

  const totalPages = Math.ceil(totalCreators / pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
  };
  
  const handleViewTypeChange = (type: "all" | "week" | "month") => {
    setViewType(type);
    setCurrentPage(1);
  };
  
  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <SidebarProvider>
      <UltraSidebar
        username={username}
        role={role}
        userId={userId || ''}
        onLogout={handleLogout}
        currentPage="creator-stats"
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <StatsHeader 
              totalCreators={totalCreators}
              totalActiveCreators={totalActiveCreators}
              onViewTypeChange={handleViewTypeChange}
              viewType={viewType}
              onRefresh={handleRefetch}
              isLoading={isLoading}
            />
            
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-slate-800/80 border-slate-700/50 hover:bg-slate-700 text-white"
            >
              <HomeIcon className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </div>

          <div className="my-6">
            <StatsSummaryCards creators={creators} />
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <SearchBar 
              value={search} 
              onChange={handleSearch} 
            />
            {role !== "agent" && (
              <ResetActionsCard
                onResetSchedules={resetAllSchedules}
                onResetDiamonds={resetAllDiamonds}
              />
            )}
          </div>

          <CreatorsTable
            creators={creators}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onRemoveCreator={handleRemoveCreator}
            onEditSchedule={handleEditSchedule}
            onEditDiamonds={handleEditDiamonds}
            onRefreshData={fetchCreators}
            role={role}
          />

          {showToast && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded shadow-lg">
              {toastMessage}
            </div>
          )}
        </div>
      </UltraSidebar>
    </SidebarProvider>
  );
};

export default CreatorStats;
