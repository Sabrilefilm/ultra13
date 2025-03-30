
import React from "react";
import {
  MessageSquare,
  Users,
  Calendar,
  Award,
  TrendingUp,
  Briefcase,
  UserPlus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAgentStats } from "@/hooks/use-agent-stats";

interface StatCardsProps {
  role: string;
  onOpenSponsorshipForm: () => void;
  onOpenSponsorshipList: () => void;
  onCreatePoster?: () => void; // Added this prop
}

export const StatCards = ({ 
  role, 
  onOpenSponsorshipForm, 
  onOpenSponsorshipList,
  onCreatePoster 
}: StatCardsProps) => {
  const { creatorCount, diamondCount, totalEvents } = useAgentStats(role);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-800/60 border-purple-900/20 hover:bg-slate-800/80 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Créateurs</p>
                <p className="text-2xl font-bold">{creatorCount || 0}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-800/60 border-purple-900/20 hover:bg-slate-800/80 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Diamants</p>
                <p className="text-2xl font-bold">{diamondCount || 0}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-800/60 border-purple-900/20 hover:bg-slate-800/80 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Parrainages</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{totalEvents || 0}</p>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-5 w-5 p-0 rounded-full"
                    onClick={onOpenSponsorshipList}
                  >
                    <Calendar className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="h-9 w-9 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400">
                <UserPlus className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-800/60 border-purple-900/20 hover:bg-slate-800/80 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Transferts</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-teal-900/30 flex items-center justify-center text-teal-400">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {['founder', 'manager'].includes(role) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-2 lg:col-span-4"
        >
          <Card className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-purple-900/20">
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between">
              <div className="space-y-1 mb-4 sm:mb-0">
                <p className="text-sm text-indigo-400">Ajouter un parrainage</p>
                <p className="text-xs text-slate-400">Augmentez vos récompenses en parrainant d'autres créateurs</p>
              </div>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                onClick={onOpenSponsorshipForm}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Nouveau parrainage
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
