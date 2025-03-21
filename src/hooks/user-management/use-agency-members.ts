
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/accounts";
import { toast } from "sonner";

export const useAgencyMembers = (agentId: string) => {
  const [assignedCreators, setAssignedCreators] = useState<Account[]>([]);
  const [unassignedCreators, setUnassignedCreators] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedCreators = async () => {
    if (!agentId) {
      console.log("No agent ID provided");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching assigned creators for agent ID:", agentId);
      
      // First try to get the agent's ID if we were passed a username
      let finalAgentId = agentId;
      
      if (agentId && !agentId.includes('-')) {
        // This might be a username, not an ID, so let's check
        const { data: agentData, error: agentError } = await supabase
          .from("user_accounts")
          .select("id")
          .eq("username", agentId)
          .eq("role", "agent")
          .single();
          
        if (agentError) {
          console.error("Error fetching agent ID:", agentError);
          throw agentError;
        }
        
        if (agentData && agentData.id) {
          finalAgentId = agentData.id;
          console.log("Resolved agent username to ID:", finalAgentId);
        }
      }
      
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("role", "creator")
        .eq("agent_id", finalAgentId);
      
      if (error) {
        console.error("Error fetching assigned creators:", error);
        throw error;
      }
      
      console.log("Assigned creators fetched:", data);
      setAssignedCreators(data as Account[]);
    } catch (error) {
      console.error("Error in fetchAssignedCreators:", error);
      toast.error("Erreur lors de la récupération des créateurs assignés");
      setAssignedCreators([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedCreators = async () => {
    try {
      setLoading(true);
      console.log("Fetching unassigned creators");
      
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("role", "creator")
        .is("agent_id", null);
      
      if (error) {
        console.error("Error fetching unassigned creators:", error);
        throw error;
      }
      
      console.log("Unassigned creators fetched:", data);
      setUnassignedCreators(data as Account[]);
    } catch (error) {
      console.error("Error in fetchUnassignedCreators:", error);
      toast.error("Erreur lors de la récupération des créateurs non assignés");
      setUnassignedCreators([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useAgencyMembers hook called with agentId:", agentId);
    fetchAssignedCreators();
    fetchUnassignedCreators();
  }, [agentId]);

  const assignCreatorToAgent = async (creatorId: string, agentId: string) => {
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: agentId })
        .eq("id", creatorId)
        .eq("role", "creator");
      
      if (error) throw error;
      
      await fetchAssignedCreators();
      await fetchUnassignedCreators();
      return true;
    } catch (error) {
      console.error("Error assigning creator to agent:", error);
      toast.error("Erreur lors de l'assignation du créateur à l'agent");
      return false;
    }
  };

  const removeCreatorFromAgent = async (creatorId: string) => {
    try {
      const { error } = await supabase
        .from("user_accounts")
        .update({ agent_id: null })
        .eq("id", creatorId);
      
      if (error) throw error;
      
      await fetchAssignedCreators();
      await fetchUnassignedCreators();
      return true;
    } catch (error) {
      console.error("Error removing creator from agent:", error);
      toast.error("Erreur lors de la suppression du créateur de l'agent");
      return false;
    }
  };

  return {
    assignedCreators,
    unassignedCreators,
    loading,
    isLoading: loading,
    fetchAssignedCreators,
    fetchUnassignedCreators, 
    assignCreatorToAgent,
    removeCreatorFromAgent
  };
};
