
import { User, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  username: string;
  handle: string;
  avatarUrl?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  username: initialUsername, 
  handle: initialHandle, 
  avatarUrl: initialAvatarUrl 
}) => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState({
    username: initialUsername,
    handle: initialHandle,
    avatarUrl: initialAvatarUrl
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Liste des types MIME autorisés
  const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { user } = session;
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, handle, avatar_url')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile({
            username: profile.username || initialUsername,
            handle: profile.handle || initialHandle,
            avatarUrl: profile.avatar_url || initialAvatarUrl
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Vérification du type de fichier avec la liste des types MIME autorisés
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast({
          title: "Type de fichier non autorisé",
          description: "Veuillez sélectionner une image (PNG, JPEG, GIF, ou WebP)",
          variant: "destructive",
        });
        return;
      }

      // Vérification de la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Non authentifié");

      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}-${Date.now()}.${fileExt}`;

      // Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Récupération de l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Mise à jour du profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      setUserProfile(prev => ({
        ...prev,
        avatarUrl: publicUrl
      }));

      toast({
        title: "Succès",
        description: "Photo de profil mise à jour",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la photo de profil",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4 p-6 animate-pulse">
        <div className="w-14 h-14 bg-primary/50 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 w-32 bg-primary/50 rounded" />
          <div className="h-4 w-24 bg-primary/50 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-6 animate-fadeIn">
      <div className="relative group">
        <Avatar className="w-14 h-14 ring-2 ring-offset-2 ring-offset-background ring-primary/50 transition-all duration-300 group-hover:ring-primary">
          <AvatarImage src={userProfile.avatarUrl} alt={userProfile.username} />
          <AvatarFallback className="bg-primary">
            <User className="w-8 h-8 text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
        <label 
          htmlFor="avatar-upload" 
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Upload className="w-6 h-6 text-white" />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="hidden"
          onChange={handleAvatarUpload}
          disabled={isUploading}
        />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">
          {isUploading ? "Mise à jour..." : `Bienvenue, ${userProfile.username}`}
        </h1>
        <p className="text-muted-foreground">{userProfile.handle}</p>
      </div>
    </div>
  );
};

