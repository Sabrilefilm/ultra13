
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Crown, Edit, SaveIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FounderMessageProps {
  className?: string;
}

export const FounderMessage: React.FC<FounderMessageProps> = ({ className = "" }) => {
  const [message, setMessage] = useState<string>(() => {
    return localStorage.getItem("founder_message") || "N'oubliez pas de faire vos heures et d'être actifs sur vos réseaux sociaux ! Bon courage à tous, votre réussite est notre priorité. 👑";
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableMessage, setEditableMessage] = useState(message);
  const [isFounder, setIsFounder] = useState(false);
  
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setIsFounder(role === "founder");
  }, []);
  
  useEffect(() => {
    localStorage.setItem("founder_message", message);
  }, [message]);
  
  const handleSave = () => {
    setMessage(editableMessage);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditableMessage(message);
    setIsEditing(false);
  };

  return (
    <Card className={`overflow-hidden border border-purple-500/30 shadow-lg bg-gradient-to-br from-purple-950/80 to-indigo-950/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 pb-3 border-b border-purple-500/20 flex flex-row items-center justify-between">
        <CardTitle className="text-sm md:text-base text-white flex items-center gap-2">
          <Crown className="h-4 w-4 text-amber-400" />
          Message du fondateur
          <BadgeCheck className="h-4 w-4 text-blue-400" />
        </CardTitle>
        
        {isFounder && !isEditing && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="h-7 w-7 p-0 rounded-full text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="sr-only">Modifier</span>
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-3 md:p-4">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <Textarea
              value={editableMessage}
              onChange={(e) => setEditableMessage(e.target.value)}
              className="min-h-[80px] bg-purple-950/30 border-purple-500/30 text-white"
              placeholder="Écrivez votre message pour les membres de l'agence..."
            />
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
              >
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                className="text-green-400 hover:text-green-300 border-green-500/30 hover:bg-green-900/30 hover:border-green-500/50"
              >
                <SaveIcon className="h-4 w-4 mr-1" />
                Enregistrer
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-white/90 text-sm md:text-base italic"
          >
            "{message}"
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
