
import { Award, Clock, Diamond, Gift, Settings, Users } from "lucide-react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = () => {
    if (password === "Marseille@13011") {
      setIsAuthenticated(true);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans le panneau d'administration",
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
          <ProfileHeader username="Fondateur" handle="@Admin" />
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
            className="ml-4"
          >
            Déconnexion
          </Button>
        </div>
        
        <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Panneau d'Administration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              variant="outline"
              className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">Gestion des Utilisateurs</span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                Gérer les comptes utilisateurs, les rôles et les permissions
              </p>
            </Button>

            <Button
              variant="outline"
              className="p-6 h-auto flex-col items-start gap-4 hover:bg-accent/5"
            >
              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-primary" />
                <span className="font-semibold">Paramètres des Récompenses</span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                Configurer les taux de conversion et les récompenses
              </p>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Utilisateurs Actifs"
            value="0"
            icon={<Users className="w-6 h-6 text-primary" />}
          />
          <StatsCard
            title="Total des Récompenses"
            value="0"
            icon={<Gift className="w-6 h-6 text-primary" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Rapports d'Activité</h2>
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                <span>Aujourd'hui</span>
                <span>0 activités</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                <span>Cette semaine</span>
                <span>0 activités</span>
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
                <span>Taux de Conversion</span>
                <span>0%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded">
                <span>Satisfaction</span>
                <span>N/A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
