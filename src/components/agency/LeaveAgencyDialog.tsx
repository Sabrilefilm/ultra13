
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { LogOut, AlertTriangle } from "lucide-react";

export function LeaveAgencyDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [leaveType, setLeaveType] = useState<"amicable" | "other" | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLeaveAgency = async (type: "amicable" | "other") => {
    setLeaveType(type);
    
    if (type === "amicable") {
      try {
        const username = localStorage.getItem('username');
        if (!username) {
          toast({
            title: "Erreur",
            description: "Impossible de récupérer votre identifiant",
            variant: "destructive",
          });
          return;
        }
        
        const { data: userData, error: userError } = await supabase
          .from('user_accounts')
          .select('id')
          .eq('username', username)
          .single();
          
        if (userError) throw userError;
        
        const { data: founderData, error: founderError } = await supabase
          .from('user_accounts')
          .select('id')
          .eq('role', 'founder')
          .single();
          
        if (founderError) throw founderError;
        
        const { error: messageError } = await supabase
          .from('chats')
          .insert({
            sender_id: userData.id,
            receiver_id: founderData.id,
            message: `Bonjour, je souhaite quitter l'agence à l'amiable. Merci de traiter ma demande.`,
            read: false,
          });
          
        if (messageError) throw messageError;
        
        toast({
          title: "Message envoyé",
          description: "Votre demande a été transmise au fondateur",
        });
        setIsOpen(false);
        navigate("/messages");
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer votre demande au fondateur",
          variant: "destructive",
        });
      }
    } else {
      setConfirmationStep(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <span className="sr-only">Ouvrir le dialogue</span>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[500px]">
          {!confirmationStep ? (
            <>
              <DialogHeader>
                <DialogTitle>Quitter l'agence</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir quitter l'agence Ultra ?
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Veuillez choisir la façon dont vous souhaitez quitter l'agence :
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleLeaveAgency("amicable")}
                    variant="outline"
                  >
                    Quitter à l'amiable
                  </Button>
                  <Button 
                    onClick={() => handleLeaveAgency("other")}
                    variant="destructive"
                  >
                    Autre moyen
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Annuler
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Procédure pour quitter l'agence</DialogTitle>
                <DialogDescription>
                  Suivez ces étapes pour quitter l'agence via TikTok:
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>Ouvrir l'application TIKTOK</li>
                  <li>Accéder à votre profil (icône en bas à droite)</li>
                  <li>Appuyer sur les 3 barres en haut à droite</li>
                  <li>Sélectionner "TIKTOK Studio"</li>
                  <li>Aller dans "LIVE"</li>
                  <li>Appuyer sur "Agence"</li>
                  <li>Suivre les instructions pour quitter l'agence</li>
                </ol>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    Information importante :
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Vos données personnelles seront conservées pour une durée de 1 mois après votre départ.
                    Votre carte d'identité sera supprimée automatiquement après cette période.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsOpen(false);
                  setConfirmationStep(false);
                }}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <div 
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={() => setIsOpen(true)}
        aria-hidden="true"
      />
    </>
  );
}
