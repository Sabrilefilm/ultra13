
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Role = 'client' | 'creator' | 'manager' | 'founder';

export const useIndexAuth = () => {
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

  const { toast } = useToast();

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUsername("");
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

  return {
    isAuthenticated,
    username,
    role,
    handleLogout,
    handleLogin,
  };
};
