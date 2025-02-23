
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import { RewardsPanel } from "@/components/RewardsPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { FounderDashboard } from "@/components/dashboard/FounderDashboard";
import { RoleStats } from "@/components/dashboard/RoleStats";
import { CreatorDashboard } from "@/components/creator/CreatorDashboard";
import { ModalManager } from "@/components/layout/ModalManager";

type Role = 'client' | 'creator' | 'manager' | 'founder';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedRole = localStorage.getItem('userRole');
    return savedAuth === 'true' && savedRole ? true : false;
  });

  const [username, setUsername] = useState(() => localStorage.getItem('username') || "");
  const [role, setRole] = useState<Role | null>(() => {
    const savedRole = localStorage.getItem('userRole');
    return savedRole as Role | null;
  });

  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [platformSettings, setPlatformSettings] = useState<{
    diamondValue: number;
    minimumPayout: number;
  } | null>(null);
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [showSponsorshipList, setShowSponsorshipList] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (role === 'founder') {
      fetchPlatformSettings();
    }
  }, [role]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role || '');
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
    }
  }, [isAuthenticated, role, username]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUsername("");
  };

  const fetchPlatformSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('diamond_value, minimum_payout')
        .single();

      if (error) throw error;
      if (data) {
        setPlatformSettings({
          diamondValue: data.diamond_value,
          minimumPayout: data.minimum_payout,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  };

  const handleLogin = async (username: string, password: string) => {
    if (!username) {
      playNotificationSound();
      toast({
        title: "Erreur",
        description: "Veuillez saisir un identifiant",
        variant: "destructive",
        duration: 60000,
      });
      return;
    }

    try {
      if (username === "Sabri" && password === "Marseille@13011") {
        setRole('founder');
        setUsername(username);
        setIsAuthenticated(true);
        playNotificationSound();
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'espace Fondateur",
          duration: 60000,
        });
      } else {
        const { data, error } = await supabase
          .from('user_accounts')
          .select('role, password')
          .eq('username', username)
          .single();

        if (error || !data) {
          throw new Error("Identifiant ou mot de passe incorrect");
        }

        if (data.password === password) {
          setRole(data.role as Role);
          setUsername(username);
          setIsAuthenticated(true);
          playNotificationSound();
          toast({
            title: "Connexion réussie",
            description: `Bienvenue dans votre espace ${data.role}`,
            duration: 60000,
          });
        } else {
          throw new Error("Identifiant ou mot de passe incorrect");
        }
      }
    } catch (error) {
      playNotificationSound();
      toast({
        title: "Erreur",
        description: "Identifiant ou mot de passe incorrect",
        variant: "destructive",
        duration: 60000,
      });
    }
  };

  const handleCreateAccount = async (role: 'creator' | 'manager', username: string, password: string) => {
    try {
      const { error } = await supabase
        .from('user_accounts')
        .insert([{ username, password, role }]);

      if (error) throw error;

      playNotificationSound();
      toast({
        title: "Compte créé",
        description: `Le compte ${role} a été créé avec succès`,
        duration: 60000,
      });
    } catch (error) {
      playNotificationSound();
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte",
        variant: "destructive",
        duration: 60000,
      });
      throw error;
    }
  };

  const handleUpdateSettings = async (diamondValue: number, minimumPayout: number) => {
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update({
          diamond_value: diamondValue,
          minimum_payout: minimumPayout
        })
        .eq('id', 1);

      if (error) throw error;

      setPlatformSettings({
        diamondValue,
        minimumPayout,
      });

      playNotificationSound();
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été mis à jour avec succès",
        duration: 60000,
      });
    } catch (error) {
      playNotificationSound();
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
        duration: 60000,
      });
      throw error;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={() => setIsForgotPasswordModalOpen(true)}
        />
        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <ProfileHeader
            username={username}
            handle={`@${role}`}
          />
          <Button
            variant="outline"
            onClick={handleLogout}
            className="ml-4"
          >
            Déconnexion
          </Button>
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
              onOpenSponsorships={() => setShowSponsorshipList(true)}
              username={username}
            />
          )}

          {role === 'creator' && (
            <CreatorDashboard
              onOpenSponsorshipForm={() => setIsSponsorshipModalOpen(true)}
              onOpenSponsorshipList={() => setShowSponsorshipList(true)}
            />
          )}

          <RoleStats role={role || ''} />
          <RewardsPanel role={role || ''} userId={username === "Sabri" ? "founder" : username} />

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
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
