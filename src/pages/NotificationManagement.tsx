
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Smartphone, Monitor, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const NotificationManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [target, setTarget] = React.useState<"all" | "mobile" | "desktop">("all");
  const [userGroup, setUserGroup] = React.useState<"all" | "creators" | "managers" | "agents">("all");

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et le message sont requis",
        variant: "destructive",
      });
      return;
    }

    try {
      // Jouer le son de notification pour tester
      const audio = new Audio('/notification.mp3');
      await audio.play();

      const { error } = await supabase.from("notifications").insert({
        title,
        message,
        target,
        user_group: userGroup,
        sent_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La notification a été envoyée",
      });

      // Réinitialiser le formulaire
      setTitle("");
      setMessage("");
      setTarget("all");
      setUserGroup("all");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Gestion des Notifications</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Envoyer une notification
              </CardTitle>
              <CardDescription>
                Créez et envoyez des notifications à vos utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Entrez le titre de la notification"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  placeholder="Entrez le message de la notification"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Plateforme cible</Label>
                <Select value={target} onValueChange={(value: "all" | "mobile" | "desktop") => setTarget(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Toutes les plateformes
                      </div>
                    </SelectItem>
                    <SelectItem value="mobile">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Mobile uniquement
                      </div>
                    </SelectItem>
                    <SelectItem value="desktop">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Bureau uniquement
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userGroup">Groupe d'utilisateurs</Label>
                <Select value={userGroup} onValueChange={(value: "all" | "creators" | "managers" | "agents") => setUserGroup(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    <SelectItem value="creators">Créateurs uniquement</SelectItem>
                    <SelectItem value="managers">Managers uniquement</SelectItem>
                    <SelectItem value="agents">Agents uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full" 
                onClick={handleSendNotification}
                disabled={!title.trim() || !message.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer la notification
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
