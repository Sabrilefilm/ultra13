
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Diamond, Clock, Calendar } from "lucide-react";

interface CreatorDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  creatorDetails: {
    username?: string;
    snapchat?: string;
    profiles?: Array<{ total_diamonds: number }>;
    live_schedules?: Array<{ hours: number; days: number }>;
  } | null;
  isFounder: boolean;
  role?: string;
}

export function CreatorDetailsDialog({ isOpen, onClose, creatorDetails, isFounder, role }: CreatorDetailsProps) {
  if (!creatorDetails) return null;
  
  const isAgent = role === 'agent';
  const hours = creatorDetails.live_schedules?.[0]?.hours || 0;
  const days = creatorDetails.live_schedules?.[0]?.days || 0;
  const diamonds = creatorDetails.profiles?.[0]?.total_diamonds || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            {creatorDetails.username ? `Détails de ${creatorDetails.username}` : 'Détails du Créateur'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isFounder && (
            <div className="bg-slate-700/50 rounded-md p-3">
              <div className="font-medium mb-1">Informations confidentielles :</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Snapchat:</span>{" "}
                <span className="bg-slate-900/50 px-2 py-1 rounded text-yellow-400">
                  {creatorDetails.snapchat || "Non renseigné"}
                </span>
              </div>
            </div>
          )}
          
          {(isFounder || isAgent) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="bg-slate-700/30 p-3 rounded-md flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium">Heures de live</span>
                </div>
                <div className="text-2xl font-bold">{hours}h</div>
                <div className="text-xs text-slate-400 mt-1">
                  {hours >= 15 ? (
                    <span className="text-green-500">Objectif atteint ✓</span>
                  ) : (
                    <span className="text-yellow-500">Objectif: 15h</span>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-700/30 p-3 rounded-md flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium">Jours streamés</span>
                </div>
                <div className="text-2xl font-bold">{days}j</div>
                <div className="text-xs text-slate-400 mt-1">
                  {days >= 7 ? (
                    <span className="text-green-500">Objectif atteint ✓</span>
                  ) : (
                    <span className="text-yellow-500">Objectif: 7j</span>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-700/30 p-3 rounded-md flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Diamond className="h-4 w-4 text-pink-400" />
                  <span className="text-sm font-medium">Diamants</span>
                </div>
                <div className="text-2xl font-bold">{diamonds.toLocaleString()} 💎</div>
                <div className="text-xs text-slate-400 mt-1">
                  {diamonds >= 20000 ? (
                    <span className="text-green-500">Objectif atteint ✓</span>
                  ) : (
                    <span className="text-yellow-500">Objectif: 20,000</span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {!isFounder && !isAgent && (
            <div className="text-center text-muted-foreground">
              Ces informations sont réservées au fondateur et aux agents.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
