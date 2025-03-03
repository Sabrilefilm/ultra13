
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock } from "lucide-react";

interface InactivityWarningProps {
  open: boolean;
  onStay: () => void;
  onLogout: () => void;
  remainingTime: string;
}

export const InactivityWarning: React.FC<InactivityWarningProps> = ({
  open,
  onStay,
  onLogout,
  remainingTime,
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Déconnexion imminente
          </AlertDialogTitle>
          <AlertDialogDescription>
            En raison d'inactivité, vous serez déconnecté dans {remainingTime}.
            Souhaitez-vous rester connecté?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onLogout}>Se déconnecter</AlertDialogCancel>
          <AlertDialogAction onClick={onStay}>Rester connecté</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
