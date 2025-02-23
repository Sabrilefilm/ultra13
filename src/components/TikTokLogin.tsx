
import { Button } from "@/components/ui/button";
import { createClient } from '@supabase/supabase-js';
import { Share2 } from "lucide-react"; // On utilise Share2 à la place de TikTok
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
        provider: 'twitter', // On utilise twitter comme provider temporairement
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
      <Share2 className="w-5 h-5" />
      Se connecter avec TikTok
    </Button>
  );
};
