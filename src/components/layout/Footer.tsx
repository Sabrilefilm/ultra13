
import { cn } from "@/lib/utils";
import { RGPDModal } from "../legal/RGPDModal";
import { ThemeToggle } from "../ui/theme-toggle";
import { Sparkles } from "lucide-react";

interface FooterProps {
  role?: string;
  className?: string;
}

export function Footer({ role, className }: FooterProps) {
  return (
    <footer className={cn("py-6 text-center border-t dark:border-gray-800", className)}>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <span className="text-sm text-muted-foreground dark:text-gray-400">
          © {new Date().getFullYear()} Tous droits réservés
        </span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <RGPDModal />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
          <span>Version 1.3</span>
        </div>
      </div>
    </footer>
  );
}
