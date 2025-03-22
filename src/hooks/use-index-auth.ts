
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Update the Role type to include 'ambassadeur'
type Role = 'client' | 'creator' | 'manager' | 'founder' | 'agent' | 'ambassadeur';

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
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem('userId') || null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  // Sauvegarde des données d'authentification
  useEffect(() => {
    if (isAuthenticated && role && username) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
      if (userId) {
        localStorage.setItem('userId', userId);
      }
    }
  }, [isAuthenticated, role, username, userId]);

  const playNotificationSound = useCallback(() => {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setRole(null);
    setUsername("");
    setUserId(null);
    localStorage.clear();
  }, []);

  const handleLogin = useCallback(async (username: string, password: string) => {
    if (!username) {
      playNotificationSound();
      toast({
        title: "Erreur",
        description: "Veuillez saisir un identifiant",
        variant: "destructive",
        duration: 6000,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (username === "Sabri" && password === "Marseille@13011") {
        setRole('founder');
        setUsername(username);
        setUserId("founder-special-id"); // Special ID for founder
        setIsAuthenticated(true);
        playNotificationSound();
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'espace Fondateur",
          duration: 6000,
        });
      } else {
        const { data, error } = await supabase
          .from('user_accounts')
          .select('id, role, password')
          .eq('username', username)
          .single();

        if (error || !data) {
          throw new Error("Identifiant ou mot de passe incorrect");
        }

        if (data.password === password) {
          setRole(data.role as Role);
          setUsername(username);
          setUserId(data.id);
          setIsAuthenticated(true);
          
          // Update last active timestamp
          await supabase
            .from('user_accounts')
            .update({ last_active: new Date().toISOString() })
            .eq('id', data.id);
            
          playNotificationSound();
          toast({
            title: "Connexion réussie",
            description: `Bienvenue dans votre espace ${data.role}`,
            duration: 6000,
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
        duration: 6000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [playNotificationSound, toast]);

  return {
    isAuthenticated,
    username,
    role,
    userId,
    isLoading,
    handleLogout,
    handleLogin,
  };
};
