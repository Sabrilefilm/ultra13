
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Edit, Trash, Plus, Settings, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Equipment {
  id: string;
  name: string;
  description: string;
  price: string;
  link: string;
  category: string;
}

interface EquipmentRecommendationsProps {
  role: string;
}

export const EquipmentRecommendations: React.FC<EquipmentRecommendationsProps> = ({ role }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([
    {
      id: "1",
      name: "Microphone Blue Yeti",
      description: "Microphone USB professionnel pour une qualité audio supérieure pendant vos lives.",
      price: "129.99€",
      link: "https://example.com/blue-yeti",
      category: "audio"
    },
    {
      id: "2",
      name: "Logitech StreamCam",
      description: "Webcam 1080p 60fps idéale pour les créateurs de contenu TikTok.",
      price: "159.99€",
      link: "https://example.com/streamcam",
      category: "video"
    },
    {
      id: "3",
      name: "Elgato Ring Light",
      description: "Éclairage LED pour améliorer la qualité visuelle de vos streams.",
      price: "99.99€",
      link: "https://example.com/ring-light",
      category: "lighting"
    }
  ]);

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsEditDialogOpen(true);
  };

  const handleAddEquipment = () => {
    setEditingEquipment({
      id: Date.now().toString(),
      name: "",
      description: "",
      price: "",
      link: "",
      category: "other"
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEquipment = () => {
    if (!editingEquipment) return;
    
    if (!editingEquipment.name || !editingEquipment.price) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (editingEquipment.id && equipmentList.some(item => item.id === editingEquipment.id)) {
      setEquipmentList(equipmentList.map(item => 
        item.id === editingEquipment.id ? editingEquipment : item
      ));
      toast.success("Équipement mis à jour avec succès");
    } else {
      setEquipmentList([...equipmentList, editingEquipment]);
      toast.success("Équipement ajouté avec succès");
    }
    
    setIsEditDialogOpen(false);
    setEditingEquipment(null);
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipmentList(equipmentList.filter(item => item.id !== id));
    toast.success("Équipement supprimé avec succès");
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "audio": return "bg-blue-500 hover:bg-blue-600";
      case "video": return "bg-purple-500 hover:bg-purple-600";
      case "lighting": return "bg-yellow-500 hover:bg-yellow-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "audio": return "Audio";
      case "video": return "Vidéo";
      case "lighting": return "Éclairage";
      default: return "Autre";
    }
  };

  return (
    <Card className="border-purple-200 dark:border-purple-900/30 overflow-hidden max-w-5xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-purple-500" />
            <span>Recommandations de Matériel</span>
          </div>
          {role === 'founder' && (
            <Button 
              onClick={handleAddEquipment} 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter du matériel
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Voici une liste de matériel recommandé pour améliorer la qualité de vos lives et de votre contenu.
        </p>
        
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {equipmentList.map((equipment) => (
              <Card key={equipment.id} className="h-full border-purple-100 dark:border-purple-900/20 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2 pt-4 px-4">
                  <Badge className={`absolute right-2 top-2 ${getCategoryBadgeColor(equipment.category)}`}>
                    {getCategoryLabel(equipment.category)}
                  </Badge>
                  <CardTitle className="text-base">{equipment.name}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {equipment.description}
                  </p>
                  <p className="font-bold text-base mt-2 text-purple-700 dark:text-purple-400">
                    {equipment.price}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between p-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => window.open(equipment.link, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                  
                  {role === 'founder' && (
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEditEquipment(equipment)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                        onClick={() => handleDeleteEquipment(equipment.id)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEquipment?.id && equipmentList.some(item => item.id === editingEquipment.id) 
                ? "Modifier l'équipement" 
                : "Ajouter un équipement"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom*</Label>
              <Input
                id="name"
                value={editingEquipment?.name || ''}
                onChange={(e) => setEditingEquipment(prev => 
                  prev ? {...prev, name: e.target.value} : null
                )}
                placeholder="Nom du produit"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingEquipment?.description || ''}
                onChange={(e) => setEditingEquipment(prev => 
                  prev ? {...prev, description: e.target.value} : null
                )}
                placeholder="Description du produit"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Prix*</Label>
              <Input
                id="price"
                value={editingEquipment?.price || ''}
                onChange={(e) => setEditingEquipment(prev => 
                  prev ? {...prev, price: e.target.value} : null
                )}
                placeholder="199.99€"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="link">Lien d'achat</Label>
              <Input
                id="link"
                value={editingEquipment?.link || ''}
                onChange={(e) => setEditingEquipment(prev => 
                  prev ? {...prev, link: e.target.value} : null
                )}
                placeholder="https://example.com/product"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                value={editingEquipment?.category || 'other'}
                onChange={(e) => setEditingEquipment(prev => 
                  prev ? {...prev, category: e.target.value} : null
                )}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="audio">Audio</option>
                <option value="video">Vidéo</option>
                <option value="lighting">Éclairage</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEquipment}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
