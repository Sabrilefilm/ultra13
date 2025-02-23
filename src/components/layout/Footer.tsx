
import { cn } from "@/lib/utils";
import { RGPDModal } from "../legal/RGPDModal";

interface FooterProps {
  role?: string;
  className?: string;
}

export function Footer({ role, className }: FooterProps) {
  return (
    <footer className={cn("py-6 text-center", className)}>
      <div className="flex items-center justify-center gap-4">
        <span className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Tous droits réservés
        </span>
        <RGPDModal />
      </div>
    </footer>
  );
}
