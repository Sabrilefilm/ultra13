
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useAccountManagement = () => {
  const { toast } = useToast();

  const handleCreateAccount = async (role: 'creator' | 'manager' | 'agent', username: string, password: string) => {
    try {
      const { error } = await supabase
        .from('user_accounts')
        .insert([{ username, password, role }]);

      if (error) throw error;

      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(console.error);

      toast({
        title: "Compte créé",
        description: `Le compte ${role} a été créé avec succès`,
        duration: 60000,
      });
    } catch (error) {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(console.error);

      toast({
        title: "Erreur",
        description: "Impossible de créer le compte",
        variant: "destructive",
        duration: 60000,
      });
      throw error;
    }
  };

  return {
    handleCreateAccount
  };
};
