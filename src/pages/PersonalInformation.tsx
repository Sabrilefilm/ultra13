
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

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

  const { data: profile, isLoading } = useQuery({
    queryKey: ["creator-profile"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getSession();
      if (!user.session) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", user.session.user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (data) setFormData(data);
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos informations",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Informations Personnelles</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border/50 shadow-lg">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={e => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={e => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_card_number">Numéro de carte d'identité</Label>
              <Input
                id="id_card_number"
                value={formData.id_card_number}
                onChange={e => setFormData(prev => ({ ...prev, id_card_number: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypal_address">Adresse PayPal</Label>
              <Input
                id="paypal_address"
                value={formData.paypal_address}
                onChange={e => setFormData(prev => ({ ...prev, paypal_address: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snapchat">Snapchat</Label>
              <Input
                id="snapchat"
                value={formData.snapchat}
                onChange={e => setFormData(prev => ({ ...prev, snapchat: e.target.value }))}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Enregistrer les modifications
          </Button>
        </form>
      </div>
    </div>
  );
}
