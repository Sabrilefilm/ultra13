
import React, { useState } from "react";
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium">Chargement...</div>
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
            onClick={() => navigate("/")}
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
                  <Label htmlFor="first_name" className="text-white/80">Prénom</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={e => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="bg-white/5 border-white/10 focus:border-purple-400/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-white/80">Nom</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={e => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="bg-white/5 border-white/10 focus:border-purple-400/50 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white/80">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-white/5 border-white/10 focus:border-purple-400/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_card_number" className="text-white/80">Numéro de carte d'identité</Label>
                <Input
                  id="id_card_number"
                  value={formData.id_card_number}
                  onChange={e => setFormData(prev => ({ ...prev, id_card_number: e.target.value }))}
                  className="bg-white/5 border-white/10 focus:border-purple-400/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/5 border-white/10 focus:border-purple-400/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paypal_address" className="text-white/80">Adresse PayPal</Label>
                <Input
                  id="paypal_address"
                  value={formData.paypal_address}
                  onChange={e => setFormData(prev => ({ ...prev, paypal_address: e.target.value }))}
                  className="bg-white/5 border-white/10 focus:border-purple-400/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="snapchat" className="text-white/80">Snapchat</Label>
                <Input
                  id="snapchat"
                  value={formData.snapchat}
                  onChange={e => setFormData(prev => ({ ...prev, snapchat: e.target.value }))}
                  className="bg-white/5 border-white/10 focus:border-purple-400/50 transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
            >
              Enregistrer les modifications
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
