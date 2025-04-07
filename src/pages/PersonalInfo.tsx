
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Key, Settings, Clock, Shield, Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const PersonalInfo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    // Simulate saving changes
    toast({
      title: "Informations mises à jour",
      description: "Vos informations personnelles ont été enregistrées."
    });
    setIsEditing(false);
  };

  const handlePasswordChangeRequested = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La modification du mot de passe sera bientôt disponible."
    });
  };

  return (
    <DashboardLayout>
      <div className="container max-w-5xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Profil</h1>
        
        <Tabs defaultValue="personal-info">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
            <TabsTrigger value="personal-info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Informations personnelles</span>
              <span className="md:hidden">Infos</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden md:inline">Mot de passe</span>
              <span className="md:hidden">MDP</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
              <span className="md:hidden">Notifs</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Sécurité</span>
              <span className="md:hidden">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden md:inline">Activité récente</span>
              <span className="md:hidden">Activité</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal-info">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et de contact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                    <Button onClick={handleSaveChanges}>Enregistrer</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Modifier</Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Modifier votre mot de passe</CardTitle>
                <CardDescription>
                  Cette fonctionnalité sera bientôt disponible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Fonctionnalité en cours de développement</h3>
                      <p className="text-muted-foreground mt-2">
                        La modification du mot de passe sera disponible prochainement.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled onClick={handlePasswordChangeRequested}>
                  Modifier le mot de passe
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Cette fonctionnalité sera bientôt disponible
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Fonctionnalité en cours de développement</h3>
                  <p className="text-muted-foreground mt-2">
                    La gestion des notifications sera disponible prochainement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Cette fonctionnalité sera bientôt disponible
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Fonctionnalité en cours de développement</h3>
                  <p className="text-muted-foreground mt-2">
                    Les paramètres de sécurité seront disponibles prochainement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  Cette fonctionnalité sera bientôt disponible
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Fonctionnalité en cours de développement</h3>
                  <p className="text-muted-foreground mt-2">
                    L'historique d'activité sera disponible prochainement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PersonalInfo;
