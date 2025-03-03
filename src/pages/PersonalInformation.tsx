
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save } from "lucide-react";

const PersonalInformation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [savedProfile, setSavedProfile] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    address: "",
    idCardNumber: "",
    email: "",
    snapchat: "",
    paypalAddress: ""
  });
  
  const [authUser, setAuthUser] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Récupérer les informations d'authentification
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole');
    
    if (!storedUsername || !storedRole) {
      navigate('/');
      return;
    }
    
    setAuthUser(storedUsername);
    setUserRole(storedRole);
    
    const fetchUserProfile = async () => {
      try {
        // Récupérer l'ID de l'utilisateur à partir du nom d'utilisateur
        const { data: userData, error: userError } = await supabase
          .from("user_accounts")
          .select("id")
          .eq("username", storedUsername)
          .single();
        
        if (userError || !userData) {
          throw new Error("Utilisateur non trouvé");
        }
        
        // Récupérer le profil du créateur
        const { data, error } = await supabase
          .from("creator_profiles")
          .select("*")
          .eq("user_id", userData.id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const creatorProfile = data[0];
          setProfile({
            firstName: creatorProfile.first_name || "",
            lastName: creatorProfile.last_name || "",
            address: creatorProfile.address || "",
            idCardNumber: creatorProfile.id_card_number || "",
            email: creatorProfile.email || "",
            snapchat: creatorProfile.snapchat || "",
            paypalAddress: creatorProfile.paypal_address || ""
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos informations personnelles."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Récupérer l'ID de l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from("user_accounts")
        .select("id")
        .eq("username", authUser)
        .single();
      
      if (userError || !userData) {
        throw new Error("Utilisateur non trouvé");
      }
      
      // Vérifier si le profil existe déjà
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from("creator_profiles")
        .select("id")
        .eq("user_id", userData.id);
      
      if (profileCheckError) throw profileCheckError;
      
      let result;
      
      if (existingProfile && existingProfile.length > 0) {
        // Mise à jour du profil existant
        result = await supabase
          .from("creator_profiles")
          .update({
            first_name: profile.firstName,
            last_name: profile.lastName,
            address: profile.address,
            id_card_number: profile.idCardNumber,
            email: profile.email,
            snapchat: profile.snapchat,
            paypal_address: profile.paypalAddress
          })
          .eq("user_id", userData.id);
      } else {
        // Création d'un nouveau profil
        result = await supabase
          .from("creator_profiles")
          .insert({
            user_id: userData.id,
            first_name: profile.firstName,
            last_name: profile.lastName,
            address: profile.address,
            id_card_number: profile.idCardNumber,
            email: profile.email,
            snapchat: profile.snapchat,
            paypal_address: profile.paypalAddress
          });
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: "Succès",
        description: "Vos informations personnelles ont été enregistrées.",
      });
      setSavedProfile(true);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du profil:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer vos informations personnelles."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const goBack = () => {
    navigate("/");
  };
  
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Button
          variant="ghost"
          onClick={goBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Informations Personnelles</CardTitle>
            <CardDescription>
              Ces informations sont nécessaires pour la gestion de votre compte et des paiements.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète</Label>
                <Input
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  placeholder="Votre adresse complète"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idCardNumber">Numéro de carte d'identité</Label>
                <Input
                  id="idCardNumber"
                  name="idCardNumber"
                  value={profile.idCardNumber}
                  onChange={handleInputChange}
                  placeholder="Numéro de votre carte d'identité"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  placeholder="Votre adresse email"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="snapchat">Snapchat (optionnel)</Label>
                  <Input
                    id="snapchat"
                    name="snapchat"
                    value={profile.snapchat}
                    onChange={handleInputChange}
                    placeholder="Votre pseudo Snapchat"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypalAddress">Adresse PayPal</Label>
                  <Input
                    id="paypalAddress"
                    name="paypalAddress"
                    value={profile.paypalAddress}
                    onChange={handleInputChange}
                    placeholder="Votre adresse PayPal pour les paiements"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={goBack}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
                {!isLoading && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PersonalInformation;
