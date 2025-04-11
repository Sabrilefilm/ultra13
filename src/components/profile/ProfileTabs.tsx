
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  User,
  Lock,
  Bell,
  Award,
  Mail,
  Phone,
  MapPin,
  Building
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

export function ProfileTabs() {
  const [success, setSuccess] = useState(false);
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid grid-cols-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg mb-6">
        <TabsTrigger value="info" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
          <User className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Informations</span>
        </TabsTrigger>
        <TabsTrigger value="password" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
          <Lock className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Mot de passe</span>
        </TabsTrigger>
        <TabsTrigger value="badges" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
          <Award className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Badges</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
          <Bell className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-slate-400" />
                  <Input id="email" placeholder="votreemail@example.com" className="glass-input" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-slate-400" />
                  <Input id="phone" placeholder="+33 6 XX XX XX XX" className="glass-input" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  <Input id="address" placeholder="Votre adresse" className="glass-input" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-slate-400" />
                  <Input id="company" placeholder="Nom de l'entreprise" className="glass-input" />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              {success && (
                <div className="mr-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-lg border border-green-500/30">
                  Informations sauvegardées
                </div>
              )}
              <Button type="submit" className="neo-button">
                Sauvegarder
              </Button>
            </div>
          </form>
        </div>
      </TabsContent>
      
      <TabsContent value="password" className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Changer votre mot de passe</h3>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" className="glass-input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" className="glass-input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input id="confirm-password" type="password" className="glass-input" />
            </div>
            <div className="pt-4">
              <Button className="neo-button">Mettre à jour</Button>
            </div>
          </form>
        </div>
      </TabsContent>
      
      <TabsContent value="badges">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Badges et réalisations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 flex flex-col items-center">
              <div className="mb-2 h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold">Premier live</h4>
              <Badge variant="glass" className="mt-2">Débloqué</Badge>
              <p className="text-xs text-center mt-2 text-slate-400">Réalisé votre premier live sur la plateforme</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex flex-col items-center">
              <div className="mb-2 h-16 w-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                <Award className="h-8 w-8 text-white/50" />
              </div>
              <h4 className="font-semibold">Expert</h4>
              <div className="mt-2">
                <Progress value={65} className="w-32 h-2" />
              </div>
              <p className="text-xs text-center mt-2 text-slate-400">65% - Atteindre 50 heures de live</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex flex-col items-center">
              <div className="mb-2 h-16 w-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                <Award className="h-8 w-8 text-white/50" />
              </div>
              <h4 className="font-semibold">Champion</h4>
              <div className="mt-2">
                <Progress value={30} className="w-32 h-2" />
              </div>
              <p className="text-xs text-center mt-2 text-slate-400">30% - Gagner 5 matchs officiels</p>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="notifications">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Paramètres de notifications</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Notifications par email</div>
                <div className="text-sm text-slate-400">Recevoir des emails pour les mises à jour importantes</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Rappels d'événements</div>
                <div className="text-sm text-slate-400">Recevoir des rappels pour les événements à venir</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Notifications marketing</div>
                <div className="text-sm text-slate-400">Recevoir des emails promotionnels et newsletters</div>
              </div>
              <Switch />
            </div>
            <div className="pt-4">
              <Button className="neo-button">Sauvegarder les préférences</Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
