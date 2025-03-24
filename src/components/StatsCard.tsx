
import { Clock } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  emoji?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, emoji }) => {
  return (
    <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg animate-fadeIn hover:scale-[1.02] transition-transform">
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
