
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Edit, Trash, Plus, Settings, Save } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const buttonAnimation = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(134, 46, 255, 0)",
        "0 0 0 10px rgba(134, 46, 255, 0.3)",
        "0 0 0 0 rgba(134, 46, 255, 0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <Card className="border-purple-200 dark:border-purple-900/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-950">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-purple-500" />
            <span>Recommandations de Matériel</span>
          </div>
          {role === 'founder' && (
            <motion.div
              animate="pulse"
              variants={buttonAnimation}
            >
              <Button 
                onClick={handleAddEquipment} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter du matériel
              </Button>
            </motion.div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Voici une liste de matériel recommandé pour améliorer la qualité de vos lives et de votre contenu.
          Ces recommandations ne sont pas obligatoires mais peuvent vous aider à améliorer votre production.
        </p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {equipmentList.map((equipment, index) => (
            <motion.div 
              key={equipment.id}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative"
            >
              <Card className="h-full border-purple-100 dark:border-purple-900/20 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <Badge className={`absolute right-2 top-2 ${getCategoryBadgeColor(equipment.category)}`}>
                    {getCategoryLabel(equipment.category)}
                  </Badge>
                  <CardTitle className="text-lg">{equipment.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {equipment.description}
                  </p>
                  <p className="font-bold text-lg mt-2 text-purple-700 dark:text-purple-400">
                    {equipment.price}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(equipment.link, '_blank')}
                  >
                    Voir le produit
                  </Button>
                  
                  {role === 'founder' && (
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditEquipment(equipment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteEquipment(equipment.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
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
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
