
import { supabase } from '@/lib/supabase';

class DiamondsService {
  /**
   * Vérifie et réinitialise les compteurs de diamants mensuels si nécessaire
   */
  async checkAndResetMonthlyDiamonds() {
    try {
      const today = new Date();
      const currentDay = today.getDate();
      
      // Réinitialiser seulement le premier jour du mois
      if (currentDay === 1) {
        console.log("Réinitialisation mensuelle des diamants...");
        
        const { error } = await supabase
          .from('creators')
          .update({ monthly_diamonds: 0 })
          .not('monthly_diamonds', 'is', null);
          
        if (error) throw error;
        
        console.log("Réinitialisation des diamants mensuels effectuée avec succès");
        return true;
      } else {
        console.log(`Today is day ${currentDay}, not performing monthly diamonds reset`);
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation mensuelle des diamants:", error);
      return false;
    }
  }
  
  /**
   * Récupère le nombre de diamants mensuels pour un créateur
   */
  async getMonthlyDiamonds(creatorId: string) {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('monthly_diamonds')
        .eq('id', creatorId)
        .single();
        
      if (error) throw error;
      
      return data?.monthly_diamonds || 0;
    } catch (error) {
      console.error("Erreur lors de la récupération des diamants mensuels:", error);
      return 0;
    }
  }
  
  /**
   * Ajoute des diamants à un créateur et met à jour le compteur mensuel
   */
  async addDiamonds(creatorId: string, amount: number, source: string) {
    try {
      // Ajouter à la table des récompenses
      const { error: rewardError } = await supabase
        .from('creator_rewards')
        .insert({
          creator_id: creatorId,
          diamonds_count: amount,
          source: source,
          created_at: new Date().toISOString()
        });
        
      if (rewardError) throw rewardError;
      
      // Mettre à jour le compteur mensuel
      const { data, error: fetchError } = await supabase
        .from('creators')
        .select('monthly_diamonds')
        .eq('id', creatorId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const currentMonthlyDiamonds = data?.monthly_diamonds || 0;
      
      const { error: updateError } = await supabase
        .from('creators')
        .update({
          monthly_diamonds: currentMonthlyDiamonds + amount
        })
        .eq('id', creatorId);
        
      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de diamants:", error);
      return false;
    }
  }
}

export const diamondsService = new DiamondsService();
