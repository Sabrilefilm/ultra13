
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RGPDModal } from "@/components/legal/RGPDModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface FooterProps {
  role?: string;
  version?: string;
  className?: string;
}

export const Footer = ({ role, version = "1.0", className = "" }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [newVersion, setNewVersion] = useState(version);
  const [currentVersion, setCurrentVersion] = useState(version);
  
  const handleUpdateVersion = () => {
    if (!newVersion.trim()) {
      toast.error("La version ne peut pas être vide");
      return;
    }
    
    setCurrentVersion(newVersion);
    toast.success(`Version mise à jour vers ${newVersion}`);
    setIsVersionDialogOpen(false);
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
                Version {currentVersion} 🚀
              </span>
              <Settings className="h-3 w-3 opacity-50" />
            </Button>
          </motion.div>
        ) : (
          <p className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs">
            Version {currentVersion} 🚀
          </p>
        )}
        
        {role === 'founder' && (
          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs">
            Mode Fondateur 👑
          </span>
        )}
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
    </footer>
  );
};
