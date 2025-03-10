
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/accounts";

export const useAgencyMembers = (agentId: string) => {
  const [assignedCreators, setAssignedCreators] = useState<Account[]>([]);
  const [unassignedCreators, setUnassignedCreators] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedCreators = async () => {
    if (!agentId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("role", "creator")
        .eq("agent_id", agentId);
      
      if (error) throw error;
      
      setAssignedCreators(data as Account[]);
    } catch (error) {
      console.error("Error fetching assigned creators:", error);
      setAssignedCreators([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedCreators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
        .eq("role", "creator")
        .is("agent_id", null);
      
      if (error) throw error;
      
      setUnassignedCreators(data as Account[]);
    } catch (error) {
      console.error("Error fetching unassigned creators:", error);
      setUnassignedCreators([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
