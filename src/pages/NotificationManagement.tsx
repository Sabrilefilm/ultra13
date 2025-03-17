
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Smartphone, Monitor, Send, User, Users } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";

const NotificationManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "mobile" | "desktop">("all");
  const [userGroup, setUserGroup] = useState<"all" | "creators" | "managers" | "agents" | "specific">("all");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("user_accounts")
          .select("id, username, role")
          .order("role", { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs:", err);
        return [];
      }
    },
  });

  if (!isAuthenticated || !['founder', 'manager'].includes(role || '')) {
    window.location.href = '/';
    return null;
  }

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
      try {
        const audio = new Audio('/notification.mp3');
        await audio.play();
      } catch (soundError) {
        console.error("Error playing notification sound:", soundError);
        // Continue even if sound doesn't play
      }

      const { error } = await supabase.from("notifications").insert({
        title,
        message,
        target,
        user_group: userGroup,
        user_id: userGroup === "specific" ? selectedUserId : null,
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
      setSelectedUserId("");
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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
        <UltraSidebar 
          username={username || ''}
          role={role || ''}
          onLogout={handleLogout}
          currentPage="notifications"
        />
        
        <div className="flex-1 p-4 md:p-6">
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

          <div className="max-w-4xl mx-auto">
            <Card className="border-purple-100 dark:border-purple-900/30 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950">
                <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                  <Bell className="h-5 w-5 text-purple-500" />
                  Envoyer une notification
                </CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-300">
                  Créez et envoyez des notifications à vos utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    placeholder="Entrez le titre de la notification"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Input
                    id="message"
                    placeholder="Entrez le message de la notification"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Plateforme cible</Label>
                  <Select value={target} onValueChange={(value: "all" | "mobile" | "desktop") => setTarget(value)}>
                    <SelectTrigger className="border-purple-200 dark:border-purple-800 focus:ring-purple-500">
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
                  <Label htmlFor="userGroup">Destinataire</Label>
                  <Select value={userGroup} onValueChange={(value: "all" | "creators" | "managers" | "agents" | "specific") => {
                    setUserGroup(value);
                    if (value !== "specific") {
                      setSelectedUserId("");
                    }
                  }}>
                    <SelectTrigger className="border-purple-200 dark:border-purple-800 focus:ring-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Tous les utilisateurs
                        </div>
                      </SelectItem>
                      <SelectItem value="creators">Créateurs uniquement</SelectItem>
                      <SelectItem value="managers">Managers uniquement</SelectItem>
                      <SelectItem value="agents">Agents uniquement</SelectItem>
                      <SelectItem value="specific">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Utilisateur spécifique
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {userGroup === "specific" && (
                  <div className="space-y-2">
                    <Label htmlFor="userId">Sélectionner l'utilisateur</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger className="border-purple-200 dark:border-purple-800 focus:ring-purple-500">
                        <SelectValue placeholder="Choisir un utilisateur" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingUsers ? (
                          <SelectItem value="loading" disabled>
                            Chargement des utilisateurs...
                          </SelectItem>
                        ) : (
                          users?.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.username} ({user.role})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                  onClick={handleSendNotification}
                  disabled={!title.trim() || !message.trim() || (userGroup === "specific" && !selectedUserId)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer la notification
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default NotificationManagement;
