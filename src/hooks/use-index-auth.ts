
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
      toast("Veuillez saisir un identifiant et un mot de passe");
      return;
    }

    try {
      console.log("Tentative de connexion avec:", username);
      const { data, error } = await supabase
        .from('user_accounts')
        .select('role, username')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        console.error("Erreur de connexion:", error);
        toast("Identifiant ou mot de passe incorrect");
        return;
      }

      setRole(data.role as Role);
      setUsername(data.username);
      setIsAuthenticated(true);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('username', data.username);

      toast(`Bienvenue dans votre espace ${data.role}`);

    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast("Identifiant ou mot de passe incorrect");
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
