
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

function Index() {
  const { isAuthenticated, username, role, handleLogout } = useIndexAuth();
  const navigate = useNavigate();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isRewardSettingsOpen, setIsRewardSettingsOpen] = useState(false);
  const [showCreatorDetails, setShowCreatorDetails] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Bienvenue sur Index
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                Connectez-vous pour accéder à votre espace
              </p>
            </div>
            <div className="w-full max-w-sm space-y-4">
              <LoginForm />
              <div className="flex justify-between">
                <Button
                  variant="link"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-sm"
                >
                  Mot de passe oublié?
                </Button>
                <Button
                  variant="link"
                  onClick={() => setIsCreateAccountOpen(true)}
                  className="text-sm"
                >
                  Créer un compte
                </Button>
              </div>
            </div>
          </div>
        </div>
        <CreateAccountModal
          isOpen={isCreateAccountOpen}
          onOpenChange={setIsCreateAccountOpen}
        />
        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onOpenChange={setIsForgotPasswordOpen}
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
          {role === "creator" && <CreatorDashboard />}
          {role === "founder" && <FounderDashboard />}
          {role === "client" && <WebCrawler />}
        </div>
      </div>

      {/* Modals */}
      <RewardSettingsModal
        isOpen={isRewardSettingsOpen}
        onOpenChange={setIsRewardSettingsOpen}
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
