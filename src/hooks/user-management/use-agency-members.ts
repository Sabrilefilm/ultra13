
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Account } from "@/types/accounts";

export const useAgencyMembers = (agentId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch creators assigned to this agent
  const { data: assignedCreators } = useQuery({
    queryKey: ["agency-members", agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("role", "creator")
        .eq("agent_id", agentId);

      if (error) throw error;
      return data as Account[];
    },
    enabled: !!agentId,
  });

  // Fetch all unassigned creators
  const { data: unassignedCreators } = useQuery({
    queryKey: ["unassigned-creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("role", "creator")
        .is("agent_id", null);

      if (error) throw error;
      return data as Account[];
    },
  });

  const assignCreatorToAgent = async (creatorId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: agentId })
        .eq("id", creatorId);

      if (error) throw error;

      toast({
        title: "Créateur assigné",
        description: "Le créateur a été assigné à cet agent avec succès",
        className: "bg-background border border-border"
      });

      queryClient.invalidateQueries({ queryKey: ["agency-members", agentId] });
      queryClient.invalidateQueries({ queryKey: ["unassigned-creators"] });
    } catch (error) {
      console.error("Erreur lors de l'assignation du créateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'assignation du créateur",
        variant: "destructive",
        className: "bg-background border border-border"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCreatorFromAgent = async (creatorId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: null })
        .eq("id", creatorId);

      if (error) throw error;

      toast({
        title: "Créateur retiré",
        description: "Le créateur a été retiré de cet agent avec succès",
        className: "bg-background border border-border"
      });

      queryClient.invalidateQueries({ queryKey: ["agency-members", agentId] });
      queryClient.invalidateQueries({ queryKey: ["unassigned-creators"] });
    } catch (error) {
      console.error("Erreur lors du retrait du créateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du retrait du créateur",
        variant: "destructive",
        className: "bg-background border border-border"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assignedCreators: assignedCreators || [],
    unassignedCreators: unassignedCreators || [],
    assignCreatorToAgent,
    removeCreatorFromAgent,
    isLoading
  };
};
