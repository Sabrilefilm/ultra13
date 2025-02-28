
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, MapPin, CreditCard, ReceiptText } from "lucide-react";
import { Input } from "@/components/ui/input";
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

const PersonalInformation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formComplete, setFormComplete] = useState(false);

  // Récupérer l'utilisateur actuel
  const username = localStorage.getItem('username') || "";
  const role = localStorage.getItem('userRole') || "";

  // État du formulaire
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    idCardNumber: "",
    paypalAddress: "",
    snapchat: "",
  });

  // Vérifier si l'utilisateur est authentifié
  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) {
      navigate('/');
    }

    // Récupérer les informations de profil existantes
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // D'abord, obtenir l'ID de l'utilisateur
        const { data: userData, error: userError } = await supabase
          .from('user_accounts')
          .select('id')
          .eq('username', username)
          .single();
        
        if (userError) {
          throw userError;
        }
        
        if (!userData) {
          return;
        }
        
        // Ensuite, récupérer le profil du créateur
        const { data: profile, error: profileError } = await supabase
          .from('creator_profiles')
          .select('*')
          .eq('user_id', userData.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw profileError;
        }
        
        if (profile) {
          setFormState({
            firstName: profile.first_name || "",
            lastName: profile.last_name || "",
            email: profile.email || "",
            address: profile.address || "",
            idCardNumber: profile.id_card_number || "",
            paypalAddress: profile.paypal_address || "",
            snapchat: profile.snapchat || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer vos informations personnelles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate, toast, username]);

  // Vérifier si le formulaire est complet
  useEffect(() => {
    // Vérifier que tous les champs obligatoires sont remplis
    const { firstName, lastName, email, address } = formState;
    setFormComplete(!!firstName && !!lastName && !!email && !!address);
  }, [formState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formComplete) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // D'abord, obtenir l'ID de l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from('user_accounts')
        .select('id')
        .eq('username', username)
        .single();
      
      if (userError) {
        throw userError;
      }
      
      // Préparer les données pour la mise à jour ou l'insertion
      const profileData = {
        user_id: userData.id,
        first_name: formState.firstName,
        last_name: formState.lastName,
        email: formState.email,
        address: formState.address,
        id_card_number: formState.idCardNumber,
        paypal_address: formState.paypalAddress,
        snapchat: formState.snapchat,
      };
      
      // Vérifier si le profil existe déjà
      const { data: existingProfile, error: checkError } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', userData.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let result;
      
      if (existingProfile) {
        // Mettre à jour le profil existant
        result = await supabase
          .from('creator_profiles')
          .update(profileData)
          .eq('id', existingProfile.id);
      } else {
        // Créer un nouveau profil
        result = await supabase
          .from('creator_profiles')
          .insert([profileData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      // Marquer le profil comme complété
      localStorage.setItem('profileCompleted', 'true');
      
      toast({
        title: "Succès",
        description: "Vos informations personnelles ont été mises à jour",
      });
      
      // Rediriger vers la page d'accueil
      navigate('/');
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos informations personnelles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4 animate-background-shift">
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
          <h1 className="text-2xl font-bold">Informations Personnelles</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Vos informations
            </CardTitle>
            <CardDescription>
              Ces informations sont nécessaires pour gérer votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-1">
                    Prénom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Entrez votre prénom"
                    value={formState.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-1">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Entrez votre nom"
                    value={formState.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" /> Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Adresse <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Votre adresse complète"
                  value={formState.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCardNumber" className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" /> Numéro de Carte d'Identité
                </Label>
                <Input
                  id="idCardNumber"
                  placeholder="Votre numéro de carte d'identité"
                  value={formState.idCardNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypalAddress" className="flex items-center gap-1">
                  <ReceiptText className="h-4 w-4" /> Adresse PayPal
                </Label>
                <Input
                  id="paypalAddress"
                  placeholder="Votre adresse PayPal pour les paiements"
                  value={formState.paypalAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="snapchat" className="flex items-center gap-1">
                  Snapchat
                </Label>
                <Input
                  id="snapchat"
                  placeholder="Votre nom d'utilisateur Snapchat"
                  value={formState.snapchat}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !formComplete}
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalInformation;
