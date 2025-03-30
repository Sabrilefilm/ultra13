
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RGPDModal } from "@/components/legal/RGPDModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, LogOut } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAppVersion } from "@/hooks/use-app-version";
import { useNavigate } from "react-router-dom";

export interface FooterProps {
  role?: string;
  className?: string;
  version?: string;
}

export const Footer = ({ role, className = "", version: propVersion }: FooterProps) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [isLeaveAgencyDialogOpen, setIsLeaveAgencyDialogOpen] = useState(false);
  const { version: hookVersion, updateVersion } = useAppVersion();
  const version = propVersion || hookVersion;
  const [newVersion, setNewVersion] = useState(version);
  
  const handleUpdateVersion = () => {
    if (!newVersion.trim()) {
      toast.error("La version ne peut pas être vide");
      return;
    }
    
    updateVersion(newVersion);
    toast.success(`Version mise à jour vers ${newVersion}`);
    setIsVersionDialogOpen(false);
  };
  
  const handleLeaveAgency = () => {
    // In a real application, this would have proper backend logic
    toast.success("Demande de départ envoyée avec succès");
    setIsLeaveAgencyDialogOpen(false);
    
    setTimeout(() => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      navigate("/");
    }, 2000);
  };
  
  return (
    <footer className={`mt-8 mb-4 text-center text-sm text-gray-400 dark:text-gray-600 ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2">
        <p>© {currentYear} Phocéen Agency</p>
        <span className="hidden md:inline">•</span>
        <p>Tous droits réservés</p>
        <span className="hidden md:inline">•</span>
        <RGPDModal />
        <span className="hidden md:inline">•</span>
        
        <div className="flex items-center gap-2">
          {role === 'creator' && (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mr-2"
            >
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 flex items-center gap-1 text-xs text-gray-400 hover:text-red-400"
                onClick={() => setIsLeaveAgencyDialogOpen(true)}
              >
                <span className="bg-red-900/20 text-red-400 px-2 py-0.5 rounded-full flex items-center">
                  <LogOut className="h-3 w-3 mr-1" />
                  Quitter l'agence
                </span>
              </Button>
            </motion.div>
          )}
          
          {role === 'founder' ? (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 flex items-center gap-1 text-xs text-gray-400 hover:text-purple-400"
                onClick={() => setIsVersionDialogOpen(true)}
              >
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  Version {version} 🚀
                </span>
                <Settings className="h-3 w-3 opacity-50" />
              </Button>
            </motion.div>
          ) : (
            <p className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs">
              Version {version} 🚀
            </p>
          )}
          
          {role === 'founder' && (
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs">
              Mode Fondateur 👑
            </span>
          )}
        </div>
      </div>
      
      <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la version</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="version">Numéro de version</Label>
              <Input
                id="version"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                placeholder="1.0.0"
              />
              <p className="text-xs text-gray-500">
                Utilisez un format standard comme 1.0.0 ou votre propre nomenclature
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVersionDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateVersion}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isLeaveAgencyDialogOpen} onOpenChange={setIsLeaveAgencyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Quitter l'agence</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Êtes-vous sûr de vouloir quitter l'agence ? Cette action est irréversible et mettra fin à votre contrat.
            </p>
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 p-3 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">
                Votre accès aux ressources de l'agence sera révoqué immédiatement et votre compte sera désactivé.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveAgencyDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleLeaveAgency}>
              <LogOut className="h-4 w-4 mr-2" />
              Confirmer mon départ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </footer>
  );
};
