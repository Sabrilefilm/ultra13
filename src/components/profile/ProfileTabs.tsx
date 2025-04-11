
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Settings, Mail, Calendar, Award, Gamepad2, Clock } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const ProfileTabs: React.FC = () => {
  const { user, username, lastLogin } = useAuth();
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

  // Mock data for badges
  const unlockedBadges = [
    { id: 1, name: "7 Day Streak", icon: <Award className="h-10 w-10 text-purple-400" />, color: "bg-purple-600" },
    { id: 2, name: "Content Creator", icon: <Award className="h-10 w-10 text-blue-400" />, color: "bg-blue-600" }
  ];
  
  const inProgressBadges = [
    { 
      id: 3, 
      name: "Goal Crusher", 
      description: "Exceed your monthly goal", 
      progress: 85, 
      max: 100,
      icon: <Award className="h-6 w-6 text-gray-400" /> 
    },
    { 
      id: 4, 
      name: "Monthly Master", 
      description: "Stream 30 days in one month", 
      progress: 7, 
      max: 30,
      icon: <Calendar className="h-6 w-6 text-gray-400" /> 
    }
  ];
  
  return (
    <Tabs defaultValue="personal-info" className="w-full">
      <TabsList className="w-full grid grid-cols-4 mb-6">
        <TabsTrigger value="personal-info" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Informations</span>
        </TabsTrigger>
        <TabsTrigger value="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>Mot de passe</span>
        </TabsTrigger>
        <TabsTrigger value="badges" className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          <span>Badges</span>
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input id="username" value={username || ''} disabled className="bg-slate-700/50" />
                </div>
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Input id="role" value={user?.role || ''} disabled className="bg-slate-700/50" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value="user@example.com" disabled className="bg-slate-700/50" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="memberSince">Membre depuis</Label>
                  <Input id="memberSince" value="15 Janvier 2023" disabled className="bg-slate-700/50" />
                </div>
                <div>
                  <Label htmlFor="platform">Plateforme préférée</Label>
                  <Input id="platform" value="TikTok" disabled className="bg-slate-700/50" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contentType">Type de contenu</Label>
                  <Input id="contentType" value="Gaming" disabled className="bg-slate-700/50" />
                </div>
                <div>
                  <Label htmlFor="schedule">Planning de stream</Label>
                  <Input id="schedule" value="Soirs, Weekends" disabled className="bg-slate-700/50" />
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Éditer le profil
              </Button>
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
      
      <TabsContent value="badges">
        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Badges et Récompenses</CardTitle>
            <CardDescription className="text-slate-400">
              Badges débloqués: 2/4
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Badges débloqués</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {unlockedBadges.map(badge => (
                    <div key={badge.id} className="bg-slate-700/50 rounded-lg p-4 flex flex-col items-center text-center">
                      <div className={`${badge.color} w-16 h-16 rounded-full flex items-center justify-center mb-3`}>
                        {badge.icon}
                      </div>
                      <h4 className="font-medium">{badge.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-4">En progression</h3>
                <div className="space-y-4">
                  {inProgressBadges.map(badge => (
                    <div key={badge.id} className="bg-slate-700/30 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-600/50 w-10 h-10 rounded-full flex items-center justify-center">
                            {badge.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{badge.name}</h4>
                            <p className="text-xs text-slate-400">{badge.description}</p>
                          </div>
                        </div>
                        <span className="text-sm text-slate-300">{badge.progress}/{badge.max}</span>
                      </div>
                      <Progress value={(badge.progress / badge.max) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <Button variant="link" className="text-purple-400">
                  Voir tous les badges
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications">
        <Card className="bg-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Préférences de notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-400" />
                <div>
                  <h4 className="font-medium">Notifications par email</h4>
                  <p className="text-xs text-slate-400">Recevez des notifications importantes par email</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-500/30">
                Activé
              </Badge>
            </div>
            
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-400" />
                <div>
                  <h4 className="font-medium">Rappels de planning</h4>
                  <p className="text-xs text-slate-400">Rappels pour vos sessions prévues</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-slate-600/20 text-slate-400 border-slate-500/30">
                Désactivé
              </Badge>
            </div>
            
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-purple-400" />
                <div>
                  <h4 className="font-medium">Badges débloqués</h4>
                  <p className="text-xs text-slate-400">Soyez notifié quand vous débloquez un badge</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-500/30">
                Activé
              </Badge>
            </div>
            
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-5 w-5 text-purple-400" />
                <div>
                  <h4 className="font-medium">Matchs à venir</h4>
                  <p className="text-xs text-slate-400">Notifications pour les matchs programmés</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-500/30">
                Activé
              </Badge>
            </div>
            
            <Button className="w-full">
              Mettre à jour les préférences
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
