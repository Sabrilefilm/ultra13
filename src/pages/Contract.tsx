
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ContractDocument } from '@/components/contract/ContractDocument';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const Contract = () => {
  const { isAuthenticated, username, role, userId } = useAuth();
  const [hasApproved, setHasApproved] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [creationDate, setCreationDate] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        // Récupérer la date de création du compte
        const { data, error } = await supabase
          .from('users')
          .select('created_at, contract_approved, contract_downloaded')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setCreationDate(data.created_at);
          setHasApproved(!!data.contract_approved);
          setHasDownloaded(!!data.contract_downloaded);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error);
      }
    };
    
    fetchUserData();
  }, [userId, isAuthenticated, navigate]);

  const handleDownload = async () => {
    try {
      // Marquer le contrat comme téléchargé
      const { error } = await supabase
        .from('users')
        .update({ contract_downloaded: true })
        .eq('id', userId);
      
      if (error) throw error;
      
      setHasDownloaded(true);
      
      toast({
        title: "Téléchargement réussi",
        description: "Le contrat a été téléchargé avec succès",
      });
      
      // Logique de téléchargement du PDF
      // (Ceci est généralement géré par le navigateur)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive"
      });
    }
  };
  
  const handleApprove = async () => {
    try {
      // Marquer le contrat comme approuvé
      const { error } = await supabase
        .from('users')
        .update({ contract_approved: true })
        .eq('id', userId);
      
      if (error) throw error;
      
      setHasApproved(true);
      
      toast({
        title: "Contrat approuvé",
        description: "Vous avez approuvé le contrat avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation du contrat",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return null; // On gère la redirection dans le useEffect
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold text-white">Contrat</h1>
        </div>
      </div>
      
      <div className="bg-slate-900/70 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-purple-800/30">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {role === 'creator' ? 'Contrat de Créateur' : 
               role === 'agent' ? 'Contrat d\'Agent' : 
               role === 'manager' ? 'Contrat de Manager' : 'Contrat de Partenariat'}
            </h2>
            <p className="text-slate-400">Fait à Marseille, le {creationDate ? formatDate(creationDate) : 'N/A'}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleDownload} className="w-full sm:w-auto">
              {hasDownloaded ? "Téléchargement effectué" : "Télécharger le contrat"}
            </Button>
            
            {!hasApproved && (
              <Button onClick={handleApprove} variant="default" className="w-full sm:w-auto">
                J'approuve le contrat
              </Button>
            )}
            
            {hasApproved && (
              <div className="px-3 py-1 bg-green-800/30 text-green-300 border border-green-700/30 rounded-md">
                Contrat approuvé
              </div>
            )}
          </div>
        </div>
        
        <div className="prose prose-invert max-w-none overflow-auto">
          <ContractDocument username={username} role={role} date={creationDate ? formatDate(creationDate) : 'N/A'} />
        </div>
      </div>
    </div>
  );
};

export default Contract;
