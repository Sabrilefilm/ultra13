
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const usePlatformSettings = (role: string | null) => {
  const [platformSettings, setPlatformSettings] = useState<{
    diamondValue: number;
    minimumPayout: number;
  } | null>(null);

  const { toast } = useToast();

  const fetchPlatformSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('diamond_value, minimum_payout')
        .single();

      if (error) throw error;
      if (data) {
        setPlatformSettings({
          diamondValue: data.diamond_value,
          minimumPayout: data.minimum_payout,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = async (diamondValue: number, minimumPayout: number) => {
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update({
          diamond_value: diamondValue,
          minimum_payout: minimumPayout
        })
        .eq('id', 1);

      if (error) throw error;

      setPlatformSettings({
        diamondValue,
        minimumPayout,
      });

      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été mis à jour avec succès",
        duration: 60000,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
        duration: 60000,
      });
      throw error;
    }
  };

  useEffect(() => {
    if (role === 'founder') {
      fetchPlatformSettings();
    }
  }, [role]);

  return {
    platformSettings,
    handleUpdateSettings
  };
};
