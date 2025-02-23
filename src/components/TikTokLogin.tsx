
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const TikTokLogin = () => {
  const { toast } = useToast();
  const TIKTOK_CLIENT_ID = 'Aw455byinoq8zkkw';

  const handleTikTokLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'tiktok' as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'user.info.basic,video.list',
          queryParams: {
            client_key: TIKTOK_CLIENT_ID
          }
        }
      });

      if (error) {
        console.error('Erreur TikTok:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter à TikTok",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
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
