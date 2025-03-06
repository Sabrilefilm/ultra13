
import { cn } from "@/lib/utils";
import { RGPDModal } from "../legal/RGPDModal";
import { ThemeToggle } from "../ui/theme-toggle";

interface FooterProps {
  role?: string;
  className?: string;
}

export function Footer({ role, className }: FooterProps) {
  return (
    <footer className={cn("py-6 text-center", className)}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <span className="text-sm text-muted-foreground dark:text-gray-400">
          © {new Date().getFullYear()} Tous droits réservés
        </span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <RGPDModal />
        </div>
      </div>
    </footer>
  );
}
