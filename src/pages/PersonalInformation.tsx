
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

export default function PersonalInformation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    id_card_number: "",
    email: "",
    paypal_address: "",
    snapchat: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFormValidated, setIsFormValidated] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["creator-profile"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getSession();
      if (!user.session) {
        toast({
          title: "Non authentifié",
          description: "Veuillez vous connecter pour accéder à cette page",
          variant: "destructive",
        });
        navigate("/");
        throw new Error("Non authentifié");
      }

      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", user.session.user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (data) {
        setFormData(data);
        validateFormData({...data});
      }
      return data;
    },
  });

  // Vérifier si l'utilisateur a rempli ses informations personnelles
  useEffect(() => {
    if (profile) {
      const isProfileComplete = validateFormData(formData);
      if (!isProfileComplete) {
        toast({
          title: "Informations incomplètes",
          description: "Veuillez remplir toutes les informations obligatoires",
          variant: "destructive",
        });
      }
    }
  }, [profile]);

  const validateFormData = (data: typeof formData) => {
    const errors: Record<string, string> = {};
    const requiredFields = ['first_name', 'last_name', 'address', 'id_card_number', 'email'];
    
    let isValid = true;
    requiredFields.forEach(field => {
      if (!data[field as keyof typeof data]) {
        errors[field] = "Ce champ est obligatoire";
        isValid = false;
      }
    });

    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = "Format d'email invalide";
      isValid = false;
    }

    setFormErrors(errors);
    setIsFormValidated(isValid);
    return isValid;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    validateFormData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData(formData)) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires correctement",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Non authentifié");

      const { error } = await supabase.from("creator_profiles").upsert({
        user_id: session.session.user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Vos informations ont été mises à jour",
      });
      
      // Rediriger vers la page principale après la sauvegarde
      navigate("/");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos informations",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400/20 to-pink-400/20 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (isFormValidated) {
                navigate("/");
              } else {
                toast({
                  title: "Informations incomplètes",
                  description: "Veuillez remplir toutes les informations obligatoires avant de continuer",
                  variant: "destructive",
                });
              }
            }}
            className="hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Informations Personnelles
          </h1>
        </div>

        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-white/80">Prénom <span className="text-red-500">*</span></Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={e => handleInputChange('first_name', e.target.value)}
                    className={`bg-white/5 border ${formErrors.first_name ? 'border-red-500' : 'border-white/10'} focus:border-purple-400/50 transition-all text-white`}
                  />
                  {formErrors.first_name && <p className="text-sm text-red-500">{formErrors.first_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-white/80">Nom <span className="text-red-500">*</span></Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={e => handleInputChange('last_name', e.target.value)}
                    className={`bg-white/5 border ${formErrors.last_name ? 'border-red-500' : 'border-white/10'} focus:border-purple-400/50 transition-all text-white`}
                  />
                  {formErrors.last_name && <p className="text-sm text-red-500">{formErrors.last_name}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white/80">Adresse <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  className={`bg-white/5 border ${formErrors.address ? 'border-red-500' : 'border-white/10'} focus:border-purple-400/50 transition-all text-white`}
                />
                {formErrors.address && <p className="text-sm text-red-500">{formErrors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_card_number" className="text-white/80">Numéro de carte d'identité <span className="text-red-500">*</span></Label>
                <Input
                  id="id_card_number"
                  value={formData.id_card_number}
                  onChange={e => handleInputChange('id_card_number', e.target.value)}
                  className={`bg-white/5 border ${formErrors.id_card_number ? 'border-red-500' : 'border-white/10'} focus:border-purple-400/50 transition-all text-white`}
                />
                {formErrors.id_card_number && <p className="text-sm text-red-500">{formErrors.id_card_number}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={`bg-white/5 border ${formErrors.email ? 'border-red-500' : 'border-white/10'} focus:border-purple-400/50 transition-all text-white`}
                />
                {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypal_address" className="text-white/80">Adresse PayPal</Label>
                <Input
                  id="paypal_address"
                  value={formData.paypal_address}
                  onChange={e => handleInputChange('paypal_address', e.target.value)}
                  className="bg-white/5 border border-white/10 focus:border-purple-400/50 transition-all text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="snapchat" className="text-white/80">Snapchat</Label>
                <Input
                  id="snapchat"
                  value={formData.snapchat}
                  onChange={e => handleInputChange('snapchat', e.target.value)}
                  className="bg-white/5 border border-white/10 focus:border-purple-400/50 transition-all text-white"
                />
              </div>
            </div>

            <div className="pt-4">
              <p className="text-white/70 text-sm mb-4"><span className="text-red-500">*</span> Champs obligatoires</p>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
