import React, { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WebCrawler } from "@/components/WebCrawler";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import { CreateAccountModal } from "@/components/CreateAccountModal";
import { CreatorDashboard } from "@/components/creator/CreatorDashboard";
import { FounderDashboard } from "@/components/dashboard/FounderDashboard";
import { RewardSettingsModal } from "@/components/RewardSettingsModal";
import { CreatorDetailsDialog } from "@/components/creator/CreatorDetailsDialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

function Index() {
  const { isAuthenticated, username, role, handleLogout } = useIndexAuth();
  const navigate = useNavigate();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isRewardSettingsOpen, setIsRewardSettingsOpen] = useState(false);
  const [showCreatorDetails, setShowCreatorDetails] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    try {
      // Simuler une connexion
      console.log("Login attempt:", username, password);
      // Ajoutez ici votre logique de connexion
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erreur de connexion");
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordOpen(true);
  };

  const handleCreateAccount = async (role: string, username: string, password: string) => {
    try {
      // Logique de création de compte
      console.log("Creating account:", { role, username, password });
      // Ajoutez ici votre logique de création de compte
    } catch (error) {
      console.error("Account creation error:", error);
      toast.error("Erreur lors de la création du compte");
    }
  };

  const handleOpenSponsorshipForm = () => {
    // Gérer l'ouverture du formulaire de parrainage
    console.log("Opening sponsorship form");
  };

  const handleOpenSponsorshipList = () => {
    // Gérer l'ouverture de la liste des parrainages
    console.log("Opening sponsorship list");
  };

  const handleConfigureRewards = () => {
    setIsRewardSettingsOpen(true);
  };

  const handleOpenLiveSchedule = (creatorId: string) => {
    // Gérer l'ouverture du planning des lives
    console.log("Opening live schedule for creator:", creatorId);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A1F2C]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8">
            <div className="w-full max-w-sm space-y-4">
              <LoginForm 
                onLogin={handleLogin}
                onForgotPassword={handleForgotPassword}
              />
            </div>
          </div>
        </div>
        <CreateAccountModal
          isOpen={isCreateAccountOpen}
          onClose={() => setIsCreateAccountOpen(false)}
          onSubmit={handleCreateAccount}
        />
        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 pt-16 pb-12">
        <div className="container px-4 md:px-6">
          <div className="flex justify-end gap-4 mb-8">
            {role === "founder" && (
              <Button
                variant="outline"
                onClick={() => navigate("/user-management")}
                className="w-full sm:w-auto"
              >
                Gestion des utilisateurs
              </Button>
            )}
            {(role === "founder" || role === "manager") && (
              <Button
                variant="outline"
                onClick={() => navigate("/rewards-management")}
                className="w-full sm:w-auto"
              >
                Gestion des récompenses
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              Déconnexion
            </Button>
          </div>

          {/* Interface principale basée sur le rôle */}
          {role === "creator" && (
            <CreatorDashboard
              onOpenSponsorshipForm={handleOpenSponsorshipForm}
              onOpenSponsorshipList={handleOpenSponsorshipList}
            />
          )}
          {role === "founder" && (
            <FounderDashboard
              onCreateAccount={() => setIsCreateAccountOpen(true)}
              onConfigureRewards={handleConfigureRewards}
              onOpenLiveSchedule={handleOpenLiveSchedule}
              onOpenSponsorships={handleOpenSponsorshipList}
              username={username || ''}
            />
          )}
          {role === "client" && <WebCrawler />}
        </div>
      </div>

      {/* Modals */}
      <RewardSettingsModal
        isOpen={isRewardSettingsOpen}
        onClose={() => setIsRewardSettingsOpen(false)}
        onSubmit={async (diamondValue, minimumPayout) => {
          // Gérer la mise à jour des récompenses
          console.log("Updating rewards:", { diamondValue, minimumPayout });
        }}
      />
      <CreatorDetailsDialog
        isOpen={showCreatorDetails}
        onClose={() => setShowCreatorDetails(false)}
        creatorDetails={null}
        isFounder={role === 'founder'}
      />
    </>
  );
}

export default Index;
