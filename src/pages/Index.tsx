
import { Award, Clock, Diamond, Gift, Settings, Users } from "lucide-react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type Role = 'creator' | 'manager' | 'founder';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const { toast } = useToast();

  const handleLogin = () => {
    if (password === "Marseille@13011") {
      setRole('founder');
      setIsAuthenticated(true);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'espace Fondateur",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Mot de passe incorrect",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  const handleCreateAccount = async (role: 'creator' | 'manager', username: string, managerId?: string) => {
    try {
      const { data: user, error: authError } = await supabase.auth.signUp({
        email: `${username}@example.com`,
        password: "password123", // Vous devriez générer un mot de passe aléatoire sécurisé
        options: {
          data: {
            role: role
          }
        }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.user?.id,
            username,
            role,
            manager_id: managerId
          }
        ]);

      if (profileError) throw profileError;

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
    }
  };

  const renderContentForRole = () => {
    switch (role) {
      case 'creator':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsCard
                title="Vos Abonnés"
                value="0"
                icon={<Users className="w-6 h-6 text-primary" />}
              />
              <StatsCard
                title="Vos Gains"
                value="0"
                icon={<Gift className="w-6 h-6 text-primary" />}
              />
            </div>
            <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Vos Statistiques</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                  <span>Temps de visionnage</span>
                  <span>0h</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                  <span>Diamants reçus</span>
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'manager':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Créateurs Assignés</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Aucun créateur assigné pour le moment
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsCard
                title="Créateurs Actifs"
                value="0"
                icon={<Users className="w-6 h-6 text-primary" />}
              />
              <StatsCard
                title="Performance Globale"
                value="0%"
                icon={<Award className="w-6 h-6 text-primary" />}
              />
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
                  onClick={() => {
                    // Ouvrir modal de création de compte
                    toast({
                      title: "Création de compte",
                      description: "Cette fonctionnalité sera bientôt disponible",
                    });
                  }}
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
                  onClick={() => {
                    // Ouvrir modal de configuration des récompenses
                    toast({
                      title: "Configuration des récompenses",
                      description: "Cette fonctionnalité sera bientôt disponible",
                    });
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Diamond className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Configuration Récompenses</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    Gérer les taux de conversion et les diamants
                  </p>
                </Button>
              </div>
            </div>

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
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Espace Fondateurs</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Veuillez vous authentifier pour accéder au panneau d'administration
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleLogin}
            >
              Accéder au panneau d'administration
            </Button>
          </div>
        </div>
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
            onClick={() => {
              setIsAuthenticated(false);
              setRole(null);
            }}
            className="ml-4"
          >
            Déconnexion
          </Button>
        </div>
        
        {renderContentForRole()}
      </div>
    </div>
  );
};

export default Index;
