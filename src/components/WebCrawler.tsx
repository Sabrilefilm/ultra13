
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import * as XLSX from 'xlsx';

export const WebCrawler = () => {
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
