
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type Role = 'client' | 'creator' | 'manager' | 'founder';

export const useIndexAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = sessionStorage.getItem('isAuthenticated');
    const savedRole = sessionStorage.getItem('userRole');
    return savedAuth === 'true' && savedRole ? true : false;
  });

  const [username, setUsername] = useState(() => sessionStorage.getItem('username') || "");
  const [role, setRole] = useState<Role | null>(() => {
    const savedRole = sessionStorage.getItem('userRole');
    return savedRole as Role | null;
  });

  const { toast } = useToast();

  // Gestionnaire pour la fermeture de la page
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // Sauvegarde des données d'authentification
  useEffect(() => {
    if (isAuthenticated && role && username) {
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('username', username);
    } else {
      sessionStorage.clear();
    }
  }, [isAuthenticated, role, username]);

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
    sessionStorage.clear();
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
