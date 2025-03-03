
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
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-amber-500" />
            Déconnexion imminente
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            En raison d'inactivité, vous serez déconnecté dans <span className="font-bold text-amber-400">{remainingTime}</span>.
            Souhaitez-vous rester connecté?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onLogout}
            className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
          >
            Se déconnecter
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onStay}
            className="bg-amber-600 text-white hover:bg-amber-500"
          >
            Rester connecté
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
