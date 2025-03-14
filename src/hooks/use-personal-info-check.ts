
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const usePersonalInfoCheck = (isAuthenticated: boolean, role: string | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasCheckedPersonalInfo, setHasCheckedPersonalInfo] = useState(false);

  useEffect(() => {
    const checkPersonalInfo = async () => {
      if (isAuthenticated && role === 'creator' && !hasCheckedPersonalInfo) {
        try {
          const { data: session } = await supabase.auth.getSession();
          
          if (session.session) {
            const { data, error } = await supabase
              .from("creator_profiles")
              .select("first_name, last_name, address, id_card_number, email")
              .eq("user_id", session.session.user.id)
              .single();
            
            if (error || !data || !data.first_name || !data.last_name || !data.address || !data.id_card_number || !data.email) {
              toast({
                title: "Informations personnelles incomplètes",
                description: "Vous devez remplir vos informations personnelles pour continuer",
                variant: "destructive",
              });
              navigate("/personal-information");
            }
          }
          
          setHasCheckedPersonalInfo(true);
        } catch (error) {
          console.error("Erreur lors de la vérification des informations personnelles:", error);
        }
      }
    };
    
    checkPersonalInfo();
  }, [isAuthenticated, role, navigate, hasCheckedPersonalInfo, toast]);

  return { hasCheckedPersonalInfo, setHasCheckedPersonalInfo };
};
