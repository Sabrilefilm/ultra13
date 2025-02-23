import { Award, Clock, Diamond, Gift, Settings, Users, Rocket } from "lucide-react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CreateAccountModal } from "@/components/CreateAccountModal";
import { RewardSettingsModal } from "@/components/RewardSettingsModal";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import { RewardsPanel } from "@/components/RewardsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveScheduleModal } from "@/components/live-schedule";

type Role = 'client' | 'creator' | 'manager' | 'founder';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedRole = localStorage.getItem('userRole');
    const savedUsername = localStorage.getItem('username');
    if (savedAuth === 'true' && savedRole) {
      return true;
    }
    return false;
  });
  const [username, setUsername] = useState(() => localStorage.getItem('username') || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(() => {
    const savedRole = localStorage.getItem('userRole');
    return savedRole as Role | null;
  });
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [platformSettings, setPlatformSettings] = useState<{
    diamondValue: number;
    minimumPayout: number;
  } | null>(null);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");

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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
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

  const handleCreateAccount = async (role: 'creator' | 'manager', username: string, password: string) => {
    try {
      const { error } = await supabase
        .from('user_accounts')
        .insert([
          {
            username,
            password,
            role
          }
        ]);

      if (error) throw error;

      toast({
        title: "Compte créé",
        description: `Le compte ${role} a été créé avec succès`,
      });
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleLogin = async () => {
    if (!username) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un identifiant",
        variant: "destructive",
      });
      return;
    }

    try {
      if (username === "Sabri" && password === "Marseille@13011") {
        setRole('founder');
        setIsAuthenticated(true);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'espace Fondateur",
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
          setIsAuthenticated(true);
          toast({
            title: "Connexion réussie",
            description: `Bienvenue dans votre espace ${data.role}`,
          });
        } else {
          throw new Error("Identifiant ou mot de passe incorrect");
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Identifiant ou mot de passe incorrect",
        variant: "destructive",
      });
      setPassword("");
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

      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleOpenLiveSchedule = (creatorId: string) => {
    setSelectedCreatorId(creatorId);
    setIsLiveScheduleModalOpen(true);
  };

  const renderContentForRole = () => {
    switch (role) {
      case 'client':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Vos Créateurs Suivis"
                value="0"
                icon={<Users className="w-6 h-6 text-primary" />}
              />
              <StatsCard
                title="Diamants Envoyés"
                value="0"
                icon={<Diamond className="w-6 h-6 text-primary" />}
              />
              <StatsCard
                title="Temps de Visionnage"
                value="0h"
                icon={<Clock className="w-6 h-6 text-primary" />}
              />
            </div>

            <RewardsPanel role="client" userId="user-id-placeholder" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Créateurs Populaires
                </h2>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Découvrez de nouveaux créateurs
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full flex justify-between items-center">
                      <span>Explorer les créateurs</span>
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Vos Récompenses
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Points de fidélité</span>
                    <span>0 pts</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Niveau</span>
                    <span>Débutant</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Voir tous les avantages
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Vos Lives Favoris</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Vous n'avez pas encore de lives favoris
                </p>
                <Button variant="outline" className="w-full">
                  Découvrir des lives
                </Button>
              </div>
            </div>
          </div>
        );

      case 'creator':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Vos Abonnés"
                value="0"
                icon={<Users className="w-6 h-6 text-primary" />}
              />
              <StatsCard
                title="Vos Gains"
                value="0 €"
                icon={<Gift className="w-6 h-6 text-primary" />}
              />
              <StatsCard
                title="Diamants Reçus"
                value="0"
                icon={<Diamond className="w-6 h-6 text-primary" />}
              />
            </div>

            <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Mes Horaires de Live</h2>
              <Button onClick={() => handleOpenLiveSchedule(username)}>
                Voir mes horaires
              </Button>
            </div>

            <RewardsPanel role="creator" userId="user-id-placeholder" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Statistiques de Live
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Temps de live aujourd'hui</span>
                    <span>0h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Temps de live cette semaine</span>
                    <span>0h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Temps de live ce mois</span>
                    <span>0h</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Performance
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Moyenne de spectateurs</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Pics de spectateurs</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Total des vues</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'manager':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Créateurs Actifs"
                value="0"
                icon={<Users className="w-6 h-6 text-primary" />}
              />
              <StatsCard
                title="Total des Gains"
                value="0 €"
                icon={<Gift className="w-6 h-6 text-primary" />}
              />
              <StatsCard
                title="Performance Moyenne"
                value="0%"
                icon={<Award className="w-6 h-6 text-primary" />}
              />
            </div>

            <RewardsPanel role="manager" userId="manager-id-placeholder" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Créateurs Assignés
                </h2>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Aucun créateur assigné pour le moment
                  </p>
                  <Button className="w-full" variant="outline">
                    Demander un nouveau créateur
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Actions Rapides
                </h2>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">
                    Générer un rapport
                  </Button>
                  <Button className="w-full" variant="outline">
                    Planifier une réunion
                  </Button>
                  <Button className="w-full" variant="outline">
                    Contacter le support
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Activité Récente</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Aucune activité récente à afficher
                </p>
              </div>
            </div>
          </div>
        );

      case 'founder':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" />
                  Configuration Globale
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  variant="outline"
                  className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5"
                  onClick={() => setIsCreateAccountModalOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Gestion des Comptes</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Créer et gérer les comptes (Créateurs, Managers)
                  </p>
                </Button>

                <Button
                  variant="outline"
                  className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5"
                  onClick={() => setIsRewardSettingsModalOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <Diamond className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Configuration Récompenses</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Gérer les taux de conversion et les diamants
                  </p>
                </Button>

                <Button
                  variant="outline"
                  className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5"
                  onClick={() => window.location.href = '/accounts'}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Espace Identifiants</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Consulter tous les identifiants et mots de passe
                  </p>
                </Button>

                <Button
                  variant="outline"
                  className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5"
                  onClick={() => handleOpenLiveSchedule(username)}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Configuration Générale</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Paramètres généraux et horaires des lives de la plateforme
                  </p>
                </Button>
              </div>
            </div>

            <RewardsPanel role="founder" userId={username === "Sabri" ? "founder" : ""} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Activité Plateforme</h2>
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Créateurs Actifs</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Managers Actifs</span>
                    <span>0</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Performance Globale</h2>
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Total Diamants</span>
                    <span>0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                    <span>Temps Total</span>
                    <span>0h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] text-white p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-[450px] mx-auto space-y-8">
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center gap-2">
                <Rocket className="w-14 h-14 text-primary animate-pulse" />
                <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
                  ULTRA
                </h1>
              </div>
              <p className="agency-text text-base bg-gradient-to-br from-white via-[#38bdf8] to-[#0ea5e9] bg-clip-text text-transparent">
                by Agency Phocéen
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white/90">Votre Espace de Connexion</h2>
              <p className="text-sm text-white/60">
                Connectez-vous pour accéder à vos données statistiques
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6 shadow-xl border border-white/10">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/90">
                  Identifiant
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Votre identifiant"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <Button
                variant="link"
                className="text-sm text-white/60 hover:text-primary p-0"
                onClick={() => setIsForgotPasswordModalOpen(true)}
              >
                Mot de passe oublié ?
              </Button>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6"
                onClick={handleLogin}
              >
                Se connecter
              </Button>
              <p className="text-sm text-center text-white/40">
                Une plateforme sécurisée pour gérer vos performances
              </p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-16 flex gap-6 text-sm text-white/40">
          <button className="hover:text-white/60 transition-colors">Aide</button>
          <button className="hover:text-white/60 transition-colors">Confidentialité</button>
          <button className="hover:text-white/60 transition-colors">Conditions</button>
        </div>

        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <ProfileHeader 
            username={role === 'founder' ? 'Fondateur' : role === 'manager' ? 'Manager' : 'Créateur'} 
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
        
        {renderContentForRole()}

        <CreateAccountModal
          isOpen={isCreateAccountModalOpen}
          onClose={() => setIsCreateAccountModalOpen(false)}
          onSubmit={handleCreateAccount}
        />

        <RewardSettingsModal
          isOpen={isRewardSettingsModalOpen}
          onClose={() => setIsRewardSettingsModalOpen(false)}
          onSubmit={handleUpdateSettings}
          currentSettings={platformSettings ?? undefined}
        />

        <LiveScheduleModal
          isOpen={isLiveScheduleModalOpen}
          onClose={() => setIsLiveScheduleModalOpen(false)}
          creatorId={selectedCreatorId}
        />
      </div>
    </div>
  );
};

export default Index;
