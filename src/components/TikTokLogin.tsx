
import { Button } from "@/components/ui/button";
import { createClient } from '@supabase/supabase-js';
import { TikTok } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const TikTokLogin = () => {
  const { toast } = useToast();

  const handleTikTokLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'tiktok',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter à TikTok",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={handleTikTokLogin}
      className="flex items-center gap-2"
    >
      <TikTok className="w-5 h-5" />
      Se connecter avec TikTok
    </Button>
  );
};
