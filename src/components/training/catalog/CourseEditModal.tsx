
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseEditModalProps, TrainingCourse } from "./types";

export const CourseEditModal: React.FC<CourseEditModalProps> = ({
  isOpen,
  onOpenChange,
  editingCourse,
  onCourseChange,
  onSave
}) => {
  if (!editingCourse) return null;
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onCourseChange({
      ...editingCourse,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: keyof TrainingCourse, value: string) => {
    onCourseChange({
      ...editingCourse,
      [name]: value
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCourse.id ? "Modifier une formation" : "Ajouter une formation"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre*</Label>
            <Input
              id="title"
              name="title"
              value={editingCourse.title}
              onChange={handleInputChange}
              placeholder="Titre de la formation"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={editingCourse.description}
              onChange={handleInputChange}
              placeholder="Description de la formation"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie*</Label>
            <Select
              value={editingCourse.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Vidéo</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="external">Ressource externe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="url">URL*</Label>
            <Input
              id="url"
              name="url"
              value={editingCourse.url}
              onChange={handleInputChange}
              placeholder="Lien vers la formation"
            />
          </div>
          
          {editingCourse.category === "video" && (
            <div className="grid gap-2">
              <Label htmlFor="duration">Durée</Label>
              <Input
                id="duration"
                name="duration"
                value={editingCourse.duration || ""}
                onChange={handleInputChange}
                placeholder="Ex: 15 min"
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="theme">Thème</Label>
            <Input
              id="theme"
              name="theme"
              value={editingCourse.theme || ""}
              onChange={handleInputChange}
              placeholder="Ex: Live TikTok"
            />
          </div>
          
          {editingCourse.category === "video" && (
            <div className="grid gap-2">
              <Label htmlFor="thumbnail">Vignette (URL)</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                value={editingCourse.thumbnail || ""}
                onChange={handleInputChange}
                placeholder="URL de la vignette"
              />
              <p className="text-xs text-muted-foreground">
                Laissez vide pour les vidéos YouTube (générée automatiquement)
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
            onClick={onSave}
          >
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
