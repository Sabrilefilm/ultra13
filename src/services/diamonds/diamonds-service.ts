
import { supabase } from '@/lib/supabase';
import { Creator } from '@/hooks/diamonds/use-diamond-fetch';

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

  /**
   * Met à jour le nombre de diamants d'un créateur en fonction de l'opération
   * @param creator Créateur ou ID du créateur
   * @param amount Montant des diamants
   * @param operation Type d'opération ('add', 'subtract', ou 'set')
   */
  async updateDiamonds(creator: Creator | string, amount: number, operation: 'add' | 'subtract' | 'set' = 'set') {
    try {
      const creatorId = typeof creator === 'string' ? creator : creator.id;
      let newAmount = amount;
      
      if (operation !== 'set') {
        // Récupérer le montant actuel
        const { data, error: fetchError } = await supabase
          .from('creators')
          .select('monthly_diamonds')
          .eq('id', creatorId)
          .single();
          
        if (fetchError) throw fetchError;
        
        const currentAmount = data?.monthly_diamonds || 0;
        
        // Calculer le nouveau montant
        if (operation === 'add') {
          newAmount = currentAmount + amount;
        } else if (operation === 'subtract') {
          newAmount = Math.max(0, currentAmount - amount);
        }
      }
      
      const { error } = await supabase
        .from('creators')
        .update({
          monthly_diamonds: newAmount
        })
        .eq('id', creatorId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des diamants:", error);
      return false;
    }
  }

  /**
   * Réinitialise tous les compteurs de diamants
   */
  async resetAllDiamonds() {
    try {
      const { error } = await supabase
        .from('creators')
        .update({ monthly_diamonds: 0 });
        
      if (error) throw error;
      
      console.log("Tous les compteurs de diamants ont été réinitialisés");
      return true;
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des compteurs:", error);
      return false;
    }
  }
}

export const diamondsService = new DiamondsService();
