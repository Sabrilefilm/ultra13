
import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User, Mail, AtSign, CreditCard, MapPin, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const PersonalInfo = () => {
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    paypal: "",
    snapchat: "",
    tiktok: "",
    address: ""
  });
  
  const isCreator = role === 'creator' || role === 'ambassadeur';
  const canEditAll = role === 'founder' || role === 'manager' || role === 'agent';

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchUserData();
    }
  }, [isAuthenticated, userId]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user data from creator_profiles table
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user data:", error);
        // If no profile exists, we'll create one later
      }
      
      // Set form data if profile exists
      if (data) {
        setFormData({
          email: data.email || "",
          paypal: data.paypal_address || "",
          snapchat: data.snapchat || "",
          tiktok: data.tiktok || "",
          address: data.address || ""
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      let result;
      
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('creator_profiles')
          .update({
            email: formData.email,
            paypal_address: formData.paypal,
            snapchat: formData.snapchat,
            tiktok: formData.tiktok,
            address: formData.address,
            updated_at: new Date()
          })
          .eq('user_id', userId);
      } else {
        // Create new profile
        result = await supabase
          .from('creator_profiles')
          .insert({
            user_id: userId,
            email: formData.email,
            paypal_address: formData.paypal,
            snapchat: formData.snapchat,
            tiktok: formData.tiktok,
            address: formData.address
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: "Informations mises à jour",
        description: "Vos informations personnelles ont été enregistrées avec succès.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error saving personal info:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de vos informations.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    window.location.href = '/';
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        <UltraSidebar
          username={username}
          role={role || ''}
          userId={userId || ''}
          onLogout={handleLogout}
          currentPage="personal-info"
        />

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <User className="h-6 w-6 mr-2 text-purple-400" />
                Informations Personnelles
              </h1>
            </div>

            <Card className="bg-slate-800/90 border-purple-500/20">
              <CardHeader className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
                <CardTitle className="text-xl text-white">
                  Modifier vos informations personnelles
                </CardTitle>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="p-6 space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-blue-400" />
                          Adresse Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="paypal" className="text-sm font-medium flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-green-400" />
                          Adresse PayPal
                        </label>
                        <Input
                          id="paypal"
                          name="paypal"
                          placeholder="votre.paypal@email.com"
                          value={formData.paypal}
                          onChange={handleChange}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="snapchat" className="text-sm font-medium flex items-center">
                          <AtSign className="h-4 w-4 mr-2 text-yellow-400" />
                          Snapchat
                        </label>
                        <Input
                          id="snapchat"
                          name="snapchat"
                          placeholder="username"
                          value={formData.snapchat}
                          onChange={handleChange}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="tiktok" className="text-sm font-medium flex items-center">
                          <AtSign className="h-4 w-4 mr-2 text-pink-400" />
                          TikTok
                        </label>
                        <Input
                          id="tiktok"
                          name="tiktok"
                          placeholder="@username"
                          value={formData.tiktok}
                          onChange={handleChange}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      
                      {canEditAll && (
                        <div className="space-y-2">
                          <label htmlFor="address" className="text-sm font-medium flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                            Adresse postale
                          </label>
                          <Input
                            id="address"
                            name="address"
                            placeholder="Votre adresse complète"
                            value={formData.address}
                            onChange={handleChange}
                            className="bg-slate-700 border-slate-600 text-white"
                            readOnly={isCreator}
                          />
                          {isCreator && (
                            <p className="text-xs text-slate-400">
                              Seul le fondateur, le manager ou l'agent peut modifier l'adresse.
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
                
                <CardFooter className="bg-slate-800/90 border-t border-slate-700/50 px-6 py-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading || isSaving}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 ml-auto"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PersonalInfo;
