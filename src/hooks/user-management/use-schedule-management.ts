
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useScheduleManagement = (refetch: () => void) => {
  const { toast } = useToast();
  
  const resetAllSchedules = async () => {
    try {
      const { error } = await supabase
        .from("live_schedules")
        .update({ hours: 0, days: 0 })
        .eq('is_active', true);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de réinitialiser les horaires.",
        });
        return;
      }

      toast({
        title: "Succès!",
        description: "Tous les horaires ont été réinitialisés.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la réinitialisation des horaires.",
      });
    }
  };

  const resetRewards = async () => {
    try {
      const { error } = await supabase
        .from("creator_rewards")
        .update({ payment_status: 'paid' })
        .eq('payment_status', 'pending');

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible de réinitialiser les récompenses.",
        });
        return;
      }

      toast({
        title: "Succès!",
        description: "Toutes les récompenses ont été marquées comme payées.",
        className: "bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200 text-purple-800"
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de la réinitialisation des récompenses.",
      });
    }
  };

  const addMatch = async (creator1: string, creator2: string, matchDate: Date, isBoost: boolean = true, agentName: string = "") => {
    try {
      const { error } = await supabase.from("upcoming_matches").insert({
        creator_id: creator1,
        opponent_id: creator2,
        match_date: matchDate.toISOString(),
        status: isBoost ? 'scheduled' : 'off',
        source: agentName || 'TikTok'
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur!",
          description: "Impossible d'ajouter le match.",
        });
        return false;
      }

      toast({
        title: "Succès!",
        description: "Le match a été ajouté avec succès.",
        className: "bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200 text-purple-800"
      });
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: "Une erreur s'est produite lors de l'ajout du match.",
      });
      return false;
    }
  };

  const processTransfer = async (requestId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      // First update the transfer request status
      const { error: updateError } = await supabase
        .from('transfer_requests')
        .update({ 
          status: status,
          rejection_reason: status === 'rejected' ? (rejectionReason || 'Demande rejetée') : null 
        })
        .eq('id', requestId);
        
      if (updateError) throw updateError;
      
      // If approved, get the request data to update the creator's agent
      if (status === 'approved') {
        const { data: requestData, error: fetchError } = await supabase
          .from('transfer_requests')
          .select('*')
          .eq('id', requestId)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Update the creator's agent
        const { error: updateAgentError } = await supabase
          .from('user_accounts')
          .update({ agent_id: requestData.requested_agent_id })
          .eq('id', requestData.creator_id);
          
        if (updateAgentError) throw updateAgentError;
      }
      
      toast({
        title: "Succès",
        description: status === 'approved' 
          ? "Transfert approuvé avec succès" 
          : "Transfert rejeté avec succès",
        className: "bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200 text-purple-800"
      });
      
      return true;
    } catch (error) {
      console.error('Error processing transfer:', error);
      toast({
        variant: "destructive",
        title: "Erreur!",
        description: `Une erreur est survenue lors du traitement du transfert.`,
      });
      return false;
    }
  };

  return {
    resetAllSchedules,
    resetRewards,
    addMatch,
    processTransfer
  };
};
