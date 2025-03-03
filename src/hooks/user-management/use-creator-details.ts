
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useCreatorDetails = () => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [creatorDetails, setCreatorDetails] = useState(null);

  const handleViewDetails = async (userId: string) => {
    setSelectedUser(userId);
    try {
      const { data, error } = await supabase
        .from("user_accounts")
        .select(`*, live_schedules (*)`)
        .eq("id", userId)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de récupérer les détails de l'utilisateur.",
        });
        return;
      }

      setCreatorDetails(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la récupération des détails de l'utilisateur.",
      });
    }
  };

  return {
    selectedUser,
    setSelectedUser,
    creatorDetails,
    handleViewDetails
  };
};
