
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  emoji?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, emoji, className }) => {
  return (
    <div className={cn("p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg animate-fadeIn hover:scale-[1.02] transition-transform", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
          {title}
          {emoji && <span className="text-xl animate-pulse">{emoji}</span>}
        </h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-primary">{value}</p>
    </div>
  );
};
