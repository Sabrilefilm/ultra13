
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const LiveDashboard = () => {
  return (
    <div className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 shadow-lg animate-fadeIn">
      <h2 className="text-xl font-bold mb-4">TikTok Live Dashboard</h2>
      <p className="text-secondary mb-4">
        Connectez-vous à votre live TikTok pour suivre les interactions
      </p>
      <div className="flex gap-4">
        <Input
          placeholder="ID du live TikTok"
          className="flex-1 bg-background/50"
        />
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          Démarrer
        </Button>
      </div>
    </div>
  );
};
