
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const TikTokLogin = () => {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter avec Google",
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
      onClick={handleGoogleLogin}
      className="flex items-center gap-2"
    >
      <Share2 className="w-5 h-5" />
      Se connecter avec Google
    </Button>
  );
};
