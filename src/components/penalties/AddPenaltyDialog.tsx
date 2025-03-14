
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AlertOctagon, User, Search } from "lucide-react";

interface AddPenaltyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
  onSuccess: () => void;
}

export const AddPenaltyDialog = ({ 
  isOpen, 
  onClose,
  userId,
  onSuccess 
}: AddPenaltyDialogProps) => {
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [durationDays, setDurationDays] = useState<number>(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      setSelectedUserId(userId);
    } else {
      setSelectedUserId(null);
    }
  }, [userId, isOpen]);

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('id, username, role')
        .ilike('username', `%${query}%`)
        .eq('role', 'creator')
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rechercher des créateurs"
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedUserId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un créateur"
      });
      return;
    }

    if (!reason) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez spécifier une raison"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Get current user ID
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Utilisateur non authentifié");

      const { error } = await supabase
        .from('penalties')
        .insert({
          user_id: selectedUserId,
          reason,
          duration_days: durationDays,
          created_by: sessionData.session.user.id,
          active: true
        });

      if (error) throw error;

      // Update user warnings count
      await supabase
        .from('user_accounts')
        .update({ warnings: supabase.rpc('increment', { inc: 1 }) })
        .eq('id', selectedUserId);

      toast({
        title: "Succès",
        description: "Pénalité ajoutée avec succès"
      });
      onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la pénalité:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la pénalité"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setReason("");
    setDurationDays(1);
    setSelectedUserId(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="bg-[#1E293B] border-gray-700 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-400" />
            Ajouter une pénalité
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!userId && (
            <div className="space-y-2">
              <Label htmlFor="user" className="text-white">Créateur</Label>
              <div className="relative">
                <Input
                  id="user"
                  placeholder="Rechercher un créateur..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  className="bg-slate-800 border-gray-700 text-white placeholder:text-gray-400 pr-8"
                />
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-gray-700 rounded-md shadow-xl max-h-60 overflow-auto">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-2 p-2 hover:bg-slate-700 cursor-pointer"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setSearchQuery(user.username);
                          setSearchResults([]);
                        }}
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-white">{user.username}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {selectedUserId && (
            <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-md">
              <User className="h-4 w-4 text-purple-400" />
              <span className="text-white">
                {userId ? "Créateur sélectionné" : searchQuery}
              </span>
              {!userId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUserId(null);
                    setSearchQuery("");
                  }}
                  className="ml-auto text-gray-400 hover:text-white"
                >
                  Changer
                </Button>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white">Raison</Label>
            <Textarea
              id="reason"
              placeholder="Raison de la pénalité..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-slate-800 border-gray-700 text-white placeholder:text-gray-400 min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-white">Durée (jours)</Label>
            <Select
              value={durationDays.toString()}
              onValueChange={(value) => setDurationDays(parseInt(value))}
            >
              <SelectTrigger className="bg-slate-800 border-gray-700 text-white">
                <SelectValue placeholder="Sélectionner une durée" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-gray-700 text-white">
                <SelectItem value="1">1 jour</SelectItem>
                <SelectItem value="3">3 jours</SelectItem>
                <SelectItem value="7">7 jours</SelectItem>
                <SelectItem value="14">14 jours</SelectItem>
                <SelectItem value="30">30 jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:text-white"
          >
            Annuler
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !selectedUserId || !reason}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {submitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              "Ajouter la pénalité"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
