
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface CreatorDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  creatorDetails: {
    first_name?: string;
    last_name?: string;
    address?: string;
    id_card_number?: string;
    email?: string;
    paypal_address?: string;
    snapchat?: string;
  } | null;
}

export function CreatorDetailsDialog({ isOpen, onClose }: CreatorDetailsProps) {
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

  const { data: profile, refetch } = useQuery({
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

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

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
      
      refetch();
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos informations",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6 py-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Prénom</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={e => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Nom</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={e => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="id_card_number">Numéro de carte d'identité</Label>
          <Input
            id="id_card_number"
            value={formData.id_card_number}
            onChange={e => setFormData(prev => ({ ...prev, id_card_number: e.target.value }))}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paypal_address">Adresse PayPal</Label>
          <Input
            id="paypal_address"
            value={formData.paypal_address}
            onChange={e => setFormData(prev => ({ ...prev, paypal_address: e.target.value }))}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="snapchat">Snapchat</Label>
          <Input
            id="snapchat"
            value={formData.snapchat}
            onChange={e => setFormData(prev => ({ ...prev, snapchat: e.target.value }))}
            className="bg-background"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
