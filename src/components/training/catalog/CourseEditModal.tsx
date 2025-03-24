
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CourseEditModalProps } from "./types";

export const CourseEditModal: React.FC<CourseEditModalProps> = ({
  isOpen,
  onOpenChange,
  editingCourse,
  onCourseChange,
  onSave
}) => {
  const handleFieldChange = (field: string, value: string) => {
    if (!editingCourse) return;
    
    const updatedCourse = {
      ...editingCourse,
      [field]: value
    };
    
    onCourseChange(updatedCourse);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingCourse?.id ? "Modifier la formation" : "Ajouter une formation"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre*</Label>
            <Input
              id="title"
              value={editingCourse?.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Titre de la formation"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editingCourse?.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Description de la formation"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie</Label>
            <select
              id="category"
              value={editingCourse?.category || 'video'}
              onChange={(e) => handleFieldChange('category', e.target.value as "video" | "document" | "external")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="video">Vidéo</option>
              <option value="document">Document</option>
              <option value="external">Ressource externe</option>
            </select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="theme">Thématique</Label>
            <select
              id="theme"
              value={editingCourse?.theme || ''}
              onChange={(e) => handleFieldChange('theme', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionner une thématique</option>
              <option value="Live TikTok">Live TikTok</option>
              <option value="Contenu">Contenu</option>
              <option value="Engagement">Engagement</option>
              <option value="Ressources">Ressources</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="url">URL*</Label>
            <Input
              id="url"
              value={editingCourse?.url || ''}
              onChange={(e) => handleFieldChange('url', e.target.value)}
              placeholder="https://example.com/course"
            />
          </div>
          
          {editingCourse?.category === 'video' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="thumbnail">URL de vignette</Label>
                <Input
                  id="thumbnail"
                  value={editingCourse?.thumbnail || ''}
                  onChange={(e) => handleFieldChange('thumbnail', e.target.value)}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="duration">Durée</Label>
                <Input
                  id="duration"
                  value={editingCourse?.duration || ''}
                  onChange={(e) => handleFieldChange('duration', e.target.value)}
                  placeholder="15 min"
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
