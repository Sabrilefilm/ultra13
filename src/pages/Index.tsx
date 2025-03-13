
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import { LoginForm } from "@/components/auth/LoginForm";
import { FounderDashboard } from "@/components/dashboard/FounderDashboard";
import { RoleStats } from "@/components/dashboard/RoleStats";
import { CreatorDashboard } from "@/components/creator/CreatorDashboard";
import { ModalManager } from "@/components/layout/ModalManager";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { useAccountManagement } from "@/hooks/use-account-management";
import { UpcomingMatches } from "@/components/dashboard/UpcomingMatches";
import { CreateMatchPosterDialog } from "@/components/matches/CreateMatchPosterDialog";
import { useInactivityTimer } from "@/hooks/use-inactivity-timer";
import { InactivityWarning } from "@/components/InactivityWarning";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, username, role, handleLogout, handleLogin } = useIndexAuth();
  const { platformSettings, handleUpdateSettings } = usePlatformSettings(role);
  const { handleCreateAccount } = useAccountManagement();

  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [isScheduleMatchModalOpen, setIsScheduleMatchModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [showSponsorshipList, setShowSponsorshipList] = useState(false);
  const [isCreatePosterModalOpen, setIsCreatePosterModalOpen] = useState(false);
  
  const [hasCheckedPersonalInfo, setHasCheckedPersonalInfo] = useState(false);

  useEffect(() => {
    const checkPersonalInfo = async () => {
      if (isAuthenticated && role === 'creator' && !hasCheckedPersonalInfo) {
        try {
          const { data: session } = await supabase.auth.getSession();
          
          if (session.session) {
            const { data, error } = await supabase
              .from("creator_profiles")
              .select("first_name, last_name, address, id_card_number, email")
              .eq("user_id", session.session.user.id)
              .single();
            
            if (error || !data || !data.first_name || !data.last_name || !data.address || !data.id_card_number || !data.email) {
              toast({
                title: "Informations personnelles incomplètes",
                description: "Vous devez remplir vos informations personnelles pour continuer",
                variant: "destructive",
              });
              navigate("/personal-information");
            }
          }
          
          setHasCheckedPersonalInfo(true);
        } catch (error) {
          console.error("Erreur lors de la vérification des informations personnelles:", error);
        }
      }
    };
    
    checkPersonalInfo();
  }, [isAuthenticated, role, navigate, hasCheckedPersonalInfo, toast]);
  
  // Système de déconnexion automatique après inactivity
  const { showWarning, dismissWarning, formattedTime } = useInactivityTimer({
    timeout: 120000, // 2 minutes
    onTimeout: () => {
      handleLogout();
      toast({
        title: "Déconnexion automatique",
        description: "Vous avez été déconnecté en raison d'inactivité.",
      });
    },
    warningTime: 30000, // Afficher l'avertissement 30 secondes avant
    onWarning: () => {
      // L'avertissement est géré par le hook et affiché via showWarning
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={() => setIsForgotPasswordModalOpen(true)}
        />
        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] text-white">
      <Header role={role} username={username} />
      
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <ProfileHeader
              username={username}
              handle={`@${role === 'founder' ? 'Fondateur' : role}`}
            />
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/60 text-right">
                <p className="lowercase">vous devez obligatoirement faire</p>
                <p className="lowercase">7J 15H de lives</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                Déconnexion
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {role === 'founder' && (
              <FounderDashboard
                onCreateAccount={() => setIsCreateAccountModalOpen(true)}
                onConfigureRewards={() => setIsRewardSettingsModalOpen(true)}
                onOpenLiveSchedule={(creatorId) => {
                  setSelectedCreatorId(creatorId);
                  setIsLiveScheduleModalOpen(true);
                }}
                onScheduleMatch={() => setIsScheduleMatchModalOpen(true)}
                onOpenSponsorships={() => setShowSponsorshipList(true)}
                onCreatePoster={() => setIsCreatePosterModalOpen(true)}
                username={username}
              />
            )}

            {['creator', 'manager', 'agent'].includes(role || '') && (
              <CreatorDashboard
                onOpenSponsorshipForm={() => setIsSponsorshipModalOpen(true)}
                onOpenSponsorshipList={() => setShowSponsorshipList(true)}
                onCreatePoster={() => setIsCreatePosterModalOpen(true)}
                role={role}
              />
            )}

            <RoleStats role={role || ''} userId={username} />
            <UpcomingMatches role={role || ''} creatorId={username} />

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
              role={role || ''}
              isScheduleMatchModalOpen={isScheduleMatchModalOpen}
              setIsScheduleMatchModalOpen={setIsScheduleMatchModalOpen}
            />

            {(['founder', 'manager', 'agent'].includes(role || '')) && (
              <CreateMatchPosterDialog
                isOpen={isCreatePosterModalOpen}
                onClose={() => setIsCreatePosterModalOpen(false)}
              />
            )}
            
            <InactivityWarning
              open={showWarning}
              onStay={dismissWarning}
              onLogout={handleLogout}
              remainingTime={formattedTime}
            />
          </div>
        </div>
      </div>
      <Footer role={role || ''} />
    </div>
  );
}

export default Index;
