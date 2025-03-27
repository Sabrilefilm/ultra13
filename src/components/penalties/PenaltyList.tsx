
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format, formatDistance, addDays, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertOctagon, CheckCircle, Calendar } from "lucide-react";
import { useUserPermissions } from "@/hooks/user-management/use-user-permissions";

interface PenaltyListProps {
  penalties: any[];
  loading: boolean;
  onRefresh: () => void;
  role: string;
}

export const PenaltyList = ({ penalties, loading, onRefresh, role }: PenaltyListProps) => {
  const { toast } = useToast();
  const [changingStatus, setChangingStatus] = useState<string | null>(null);
  const permissions = useUserPermissions(role);

  const canManagePenalties = ['founder', 'manager', 'agent'].includes(role);

  const togglePenaltyActive = async (penaltyId: string, currentStatus: boolean) => {
    setChangingStatus(penaltyId);
    try {
      const { error } = await supabase
        .from('penalties')
        .update({ active: !currentStatus })
        .eq('id', penaltyId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Pénalité ${currentStatus ? 'désactivée' : 'activée'} avec succès`,
      });
      onRefresh();
    } catch (error) {
      console.error("Erreur lors de la modification du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut de la pénalité"
      });
    } finally {
      setChangingStatus(null);
    }
  };

  // Calcule la date de fin de suspension
  const calculateSuspensionEndDate = (createdAt: string, durationDays: number) => {
    const startDate = new Date(createdAt);
    const endDate = addDays(startDate, durationDays);
    return endDate;
  };

  // Vérifie si la pénalité est encore active dans le temps
  const isPenaltyActive = (createdAt: string, durationDays: number) => {
    const endDate = calculateSuspensionEndDate(createdAt, durationDays);
    return isAfter(endDate, new Date());
  };

  // Formate pour afficher la durée restante
  const formatRemainingDuration = (createdAt: string, durationDays: number) => {
    const endDate = calculateSuspensionEndDate(createdAt, durationDays);
    if (isAfter(endDate, new Date())) {
      return formatDistance(endDate, new Date(), { addSuffix: true, locale: fr });
    }
    return "Terminée";
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full bg-slate-700/50" />
          </div>
        ))}
      </div>
    );
  }

  if (penalties.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-400" />
        </div>
        <h3 className="text-xl font-medium text-white mb-1">Aucune pénalité</h3>
        <p className="text-gray-400">
          {role === 'creator' 
            ? "Vous n'avez pas reçu de pénalités." 
            : "Aucune pénalité n'a été trouvée."}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-700">
          <TableHead className="text-gray-400">Créateur</TableHead>
          <TableHead className="text-gray-400">Raison</TableHead>
          <TableHead className="text-gray-400">Durée</TableHead>
          <TableHead className="text-gray-400">Date</TableHead>
          <TableHead className="text-gray-400">Status</TableHead>
          <TableHead className="text-gray-400">Fin de suspension</TableHead>
          {canManagePenalties && <TableHead className="text-gray-400">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {penalties.map((penalty) => {
          const endDate = calculateSuspensionEndDate(penalty.created_at, penalty.duration_days);
          const isTimeActive = isPenaltyActive(penalty.created_at, penalty.duration_days);
          const remainingTime = formatRemainingDuration(penalty.created_at, penalty.duration_days);
          
          return (
            <TableRow key={penalty.id} className="border-gray-700 hover:bg-slate-800/50">
              <TableCell className="text-white">
                {penalty.user_accounts?.username || "Inconnu"}
              </TableCell>
              <TableCell className="text-white">{penalty.reason}</TableCell>
              <TableCell className="text-white">
                {penalty.duration_days} jour{penalty.duration_days > 1 ? 's' : ''}
              </TableCell>
              <TableCell className="text-white">
                {format(new Date(penalty.created_at), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell>
                <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                  penalty.active && isTimeActive
                    ? 'bg-red-500/20 text-red-400 border border-red-600/30' 
                    : 'bg-green-500/20 text-green-400 border border-green-600/30'
                }`}>
                  {penalty.active && isTimeActive ? (
                    <>
                      <AlertOctagon className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-white">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                  <span>
                    {format(endDate, 'dd MMM yyyy', { locale: fr })}
                    <div className="text-xs text-gray-400">{remainingTime}</div>
                  </span>
                </div>
              </TableCell>
              {canManagePenalties && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePenaltyActive(penalty.id, penalty.active)}
                    disabled={changingStatus === penalty.id}
                    className={penalty.active ? 'text-green-400' : 'text-red-400'}
                  >
                    {changingStatus === penalty.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : penalty.active ? (
                      'Désactiver'
                    ) : (
                      'Activer'
                    )}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
