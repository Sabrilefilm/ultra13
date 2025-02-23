
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const WebCrawler = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const crawlPage = async () => {
    if (!url) {
      toast({
        title: "URL requise",
        description: "Veuillez entrer une URL à analyser",
        variant: "destructive",
      });
      return;
    }

    // Vérifier si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour analyser une page",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Création d'un DOM parser pour extraire les informations
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extraction des informations
      const title = doc.querySelector('title')?.textContent || '';
      const content = doc.body.textContent || '';
      const metadata = {
        description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        keywords: doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
      };

      // Sauvegarde dans Supabase avec l'ID de l'utilisateur
      const { data, error } = await supabase
        .from('crawled_pages')
        .insert([
          {
            url,
            title,
            content,
            metadata,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Page analysée avec succès",
        description: `Informations extraites de : ${url}`,
      });

    } catch (error) {
      console.error('Erreur lors du crawling:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser cette page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border shadow-sm">
      <h2 className="text-xl font-bold">Analyser une page web</h2>
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Entrez l'URL de la page à analyser"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={crawlPage}
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? (
            "Analyse..."
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Analyser
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
