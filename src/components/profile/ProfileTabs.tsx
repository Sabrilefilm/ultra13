
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Settings, Mail } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export const ProfileTabs: React.FC = () => {
  const { user, username } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Fonctionnalité à venir",
      description: "Le changement de mot de passe sera bientôt disponible",
    });
  };
  
  return (
    <Tabs defaultValue="personal-info" className="w-full">
      <TabsList className="w-full grid grid-cols-3 mb-6">
        <TabsTrigger value="personal-info" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Informations</span>
        </TabsTrigger>
        <TabsTrigger value="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>Mot de passe</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>Notifications</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal-info">
        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input id="username" value={username || ''} disabled className="bg-slate-700/50" />
                </div>
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Input id="role" value={user?.role || ''} disabled className="bg-slate-700/50" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="password">
        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Changer de mot de passe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-slate-700/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-700/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-700/50"
                />
              </div>
              <Button type="submit" className="w-full">Mettre à jour</Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications">
        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Préférences de notifications</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-300">Cette fonctionnalité sera bientôt disponible</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
