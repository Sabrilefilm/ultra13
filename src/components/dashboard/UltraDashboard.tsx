import { useState } from "react";
import { InactivityWarning } from "@/components/InactivityWarning";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { CreateMatchPosterDialog } from "@/components/matches/CreateMatchPosterDialog";
import { ModalManager } from "@/components/layout/ModalManager";
import { RedesignedDashContent } from "@/components/dashboard/RedesignedDashContent";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { SocialCommunityLinks } from "@/components/layout/SocialCommunityLinks";

interface UltraDashboardProps {
  username: string;
  role: string;
  userId: string;
  onLogout: () => void;
  platformSettings: { diamondValue: number; minimumPayout: number; } | null;
  handleCreateAccount: (role: 'creator' | 'manager' | 'agent', username: string, password: string) => Promise<void>;
  handleUpdateSettings: (diamondValue: number, minimumPayout: number) => Promise<void>;
  showWarning: boolean;
  dismissWarning: () => void;
  formattedTime: string;
  currentPage?: string;
  children?: React.ReactNode;
}

export const UltraDashboard = ({
  username,
  role,
  userId,
  onLogout,
  platformSettings,
  handleCreateAccount,
  handleUpdateSettings,
  showWarning,
  dismissWarning,
  formattedTime,
  currentPage = 'dashboard',
  children
}: UltraDashboardProps) => {
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [isScheduleMatchModalOpen, setIsScheduleMatchModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [showSponsorshipList, setShowSponsorshipList] = useState(false);
  const [isCreatePosterModalOpen, setIsCreatePosterModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();

  const onAction = (action: string, data?: any) => {
    switch (action) {
      case 'openCreateAccount':
        setIsCreateAccountModalOpen(true);
        break;
      case 'openRewardSettings':
        setIsRewardSettingsModalOpen(true);
        break;
      case 'openLiveSchedule':
        setSelectedCreatorId(data);
        setIsLiveScheduleModalOpen(true);
        break;
      case 'openScheduleMatch':
        setIsScheduleMatchModalOpen(true);
        break;
      case 'openSponsorshipForm':
        setIsSponsorshipModalOpen(true);
        break;
      case 'openSponsorshipList':
        setShowSponsorshipList(true);
        break;
      case 'openCreatePoster':
        setIsCreatePosterModalOpen(true);
        break;
      case 'navigateTo':
        navigate(data === 'dashboard' ? '/' : `/${data}`);
        break;
      case 'toggleSidebar':
        setSidebarCollapsed(!sidebarCollapsed);
        break;
      case 'toggleMobileMenu':
        setMobileMenuOpen(!mobileMenuOpen);
        break;
      default:
        break;
    }
  };

  const usernameWatermark = (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {Array.from({ length: 500 }).map((_, index) => (
        <div 
          key={index} 
          className="absolute text-[8px] font-bold text-slate-200/10" 
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          {username.toUpperCase()}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
      {usernameWatermark}
      
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-slate-800/60 backdrop-blur-sm border-slate-700"
          onClick={() => onAction('toggleMobileMenu')}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex h-full">
        <div className={`${mobileMenuOpen ? 'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden' : 'hidden md:block'}`}>
          <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                          transition-transform duration-300 h-full w-64 md:w-auto z-50`}>
            <UltraSidebar 
              username={username}
              role={role}
              userId={userId}
              onLogout={onLogout}
              onAction={onAction}
              currentPage={currentPage}
              isMobileOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto pb-20 transition-all duration-300 flex flex-col">
          <div className="flex-1 flex flex-col md:flex-row">
            <div className="flex-1 overflow-auto">
              {children ? (
                children
              ) : (
                <RedesignedDashContent
                  username={username}
                  role={role}
                  currentPage={currentPage}
                  onAction={onAction}
                />
              )}
            </div>
            
            <div className="w-full md:w-80 p-4">
              <SocialCommunityLinks onLogout={onLogout} className="sticky top-4" />
            </div>
          </div>
          
          <ModalManager
            isCreateAccountModalOpen={isCreateAccountModalOpen}
            setIsCreateAccountModalOpen={setIsCreateAccountModalOpen}
            isRewardSettingsModalOpen={isRewardSettingsModalOpen}
            setIsRewardSettingsModalOpen={setIsRewardSettingsModalOpen}
            isLiveScheduleModalOpen={isLiveScheduleModalOpen}
            setIsLiveScheduleModalOpen={setIsLiveScheduleModalOpen}
            isSponsorshipModalOpen={isSponsorshipModalOpen}
            setIsSponsorshipModalOpen={setIsSponsorshipModalOpen}
            showSponsorshipList={showSponsorshipList}
            setShowSponsorshipList={setShowSponsorshipList}
            selectedCreatorId={selectedCreatorId}
            platformSettings={platformSettings}
            handleCreateAccount={handleCreateAccount}
            handleUpdateSettings={handleUpdateSettings}
            username={username}
            role={role}
            isScheduleMatchModalOpen={isScheduleMatchModalOpen}
            setIsScheduleMatchModalOpen={setIsScheduleMatchModalOpen}
          />

          {(['founder', 'manager', 'agent'].includes(role)) && (
            <CreateMatchPosterDialog
              isOpen={isCreatePosterModalOpen}
              onClose={() => setIsCreatePosterModalOpen(false)}
            />
          )}
          
          <InactivityWarning
            open={showWarning}
            onStay={dismissWarning}
            onLogout={onLogout}
            remainingTime={formattedTime}
          />
          
          <Footer role={role} className="mt-auto" />
        </div>
      </div>
    </div>
  );
};
