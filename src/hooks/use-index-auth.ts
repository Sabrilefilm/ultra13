
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setRole(null);
    setUsername("");
  };

  const handleLogin = async (username: string, password: string) => {
    if (!username || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un identifiant et un mot de passe",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('role, username')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error("Identifiant ou mot de passe incorrect");
      }

      setRole(data.role as Role);
      setUsername(data.username);
      setIsAuthenticated(true);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('username', data.username);

      toast({
        title: "Connexion réussie",
        description: `Bienvenue dans votre espace ${data.role}`,
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Identifiant ou mot de passe incorrect",
        variant: "destructive",
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
