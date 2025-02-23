
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import * as XLSX from 'xlsx';

export const WebCrawler = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [crawledPages, setCrawledPages] = useState<any[]>([]);
  const { toast } = useToast();

  // Charger les données au chargement du composant et les mettre à jour toutes les 30 secondes
  useEffect(() => {
    loadCrawledPages();
    const interval = setInterval(loadCrawledPages, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadCrawledPages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('crawled_pages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des pages:', error);
      return;
    }

    setCrawledPages(data || []);
  };

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
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const title = doc.querySelector('title')?.textContent || '';
      const content = doc.body.textContent || '';
      const metadata = {
        description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        keywords: doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
      };

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

      // Recharger les données après l'ajout
      loadCrawledPages();

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

  const exportToExcel = () => {
    try {
      // Préparer les données pour l'export
      const exportData = crawledPages.map(page => ({
        URL: page.url,
        Titre: page.title,
        Description: page.metadata?.description || '',
        'Mots-clés': page.metadata?.keywords || '',
        'Date de crawl': new Date(page.created_at).toLocaleString(),
      }));

      // Créer un nouveau workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Ajouter la worksheet au workbook
      XLSX.utils.book_append_sheet(wb, ws, "Pages Crawlées");

      // Générer le fichier Excel
      XLSX.writeFile(wb, `pages_crawlees_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast({
        title: "Export réussi",
        description: "Les données ont été exportées au format Excel",
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
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

      {crawledPages.length > 0 && (
        <div className="space-y-4 p-4 bg-card rounded-lg border shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Pages analysées</h2>
            <Button onClick={exportToExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter en Excel
            </Button>
          </div>
          <div className="space-y-4">
            {crawledPages.map((page) => (
              <div key={page.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{page.title || 'Sans titre'}</h3>
                <a href={page.url} target="_blank" rel="noopener noreferrer" 
                   className="text-sm text-blue-500 hover:underline">
                  {page.url}
                </a>
                <p className="text-sm text-gray-500 mt-2">
                  Crawlé le {new Date(page.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
