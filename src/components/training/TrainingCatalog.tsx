
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Edit, Trash, Plus, Link, Video } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tab, Tabs, TabList, TabPanel } from '@/components/ui/tabs';

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: "video" | "document" | "external";
  url: string;
  thumbnail?: string;
  duration?: string;
}

interface TrainingCatalogProps {
  role: string;
}

export const TrainingCatalog: React.FC<TrainingCatalogProps> = ({ role }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | null>(null);
  
  const [courses, setCourses] = useState<TrainingCourse[]>([
    {
      id: "1",
      title: "Les bases du live streaming",
      description: "Apprenez comment configurer votre équipement et optimiser votre stream.",
      category: "video",
      url: "https://example.com/video1",
      thumbnail: "/placeholder.svg",
      duration: "15 min"
    },
    {
      id: "2",
      title: "Guide de l'interface TikTok Live",
      description: "Comprendre et maîtriser l'interface de streaming de TikTok.",
      category: "document",
      url: "https://example.com/doc1",
    },
    {
      id: "3",
      title: "Interaction avec l'audience",
      description: "Techniques pour engager efficacement votre audience pendant les lives.",
      category: "video",
      url: "https://example.com/video2",
      thumbnail: "/placeholder.svg",
      duration: "22 min"
    },
    {
      id: "4",
      title: "Ressources d'auto-formation",
      description: "Liste de ressources externes pour continuer à vous former.",
      category: "external",
      url: "https://www.tiktok.com/creator-center/",
    }
  ]);

  const handleAddCourse = () => {
    setEditingCourse({
      id: Date.now().toString(),
      title: "",
      description: "",
      category: activeTab as "video" | "document" | "external",
      url: "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditCourse = (course: TrainingCourse) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    toast.success("Formation supprimée avec succès");
  };

  const handleSaveCourse = () => {
    if (!editingCourse) return;
    
    if (!editingCourse.title || !editingCourse.url) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (courses.some(course => course.id === editingCourse.id)) {
      setCourses(courses.map(course => 
        course.id === editingCourse.id ? editingCourse : course
      ));
      toast.success("Formation mise à jour avec succès");
    } else {
      setCourses([...courses, editingCourse]);
      toast.success("Formation ajoutée avec succès");
    }
    
    setIsEditModalOpen(false);
    setEditingCourse(null);
  };

  const filteredCourses = courses.filter(course => course.category === activeTab);

  return (
    <Card className="border-blue-200 dark:border-blue-900/30 overflow-hidden max-w-5xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-950">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <span>Catalogue de Formations</span>
          </div>
          {role === 'founder' && (
            <Button 
              onClick={handleAddCourse} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une formation
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabList className="grid grid-cols-3 mb-4">
            <Tab value="video">Vidéos</Tab>
            <Tab value="document">Documents</Tab>
            <Tab value="external">Ressources Externes</Tab>
          </TabList>
          
          <TabPanel value="video" className="pt-2">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden border-blue-100 dark:border-blue-900/20">
                    <div className="relative aspect-video bg-blue-100 dark:bg-blue-900/20">
                      <img 
                        src={course.thumbnail || "/placeholder.svg"} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {course.duration && (
                        <Badge className="absolute bottom-2 right-2 bg-black/70">
                          {course.duration}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-base">{course.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {course.description}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => window.open(course.url, '_blank')}
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Visionner
                        </Button>
                        
                        {role === 'founder' && (
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabPanel>
          
          <TabPanel value="document" className="pt-2">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden border-blue-100 dark:border-blue-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-base">{course.title}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-3">
                            {course.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => window.open(course.url, '_blank')}
                            >
                              Télécharger
                            </Button>
                            
                            {role === 'founder' && (
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                                  onClick={() => handleDeleteCourse(course.id)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabPanel>
          
          <TabPanel value="external" className="pt-2">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden border-blue-100 dark:border-blue-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                          <Link className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-base">{course.title}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-3">
                            {course.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => window.open(course.url, '_blank')}
                            >
                              Visiter le site
                            </Button>
                            
                            {role === 'founder' && (
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                                  onClick={() => handleDeleteCourse(course.id)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabPanel>
        </Tabs>
      </CardContent>
      
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCourse?.id && courses.some(course => course.id === editingCourse.id)
                ? "Modifier la formation"
                : "Ajouter une formation"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre*</Label>
              <Input
                id="title"
                value={editingCourse?.title || ''}
                onChange={(e) => setEditingCourse(prev => 
                  prev ? {...prev, title: e.target.value} : null
                )}
                placeholder="Titre de la formation"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingCourse?.description || ''}
                onChange={(e) => setEditingCourse(prev => 
                  prev ? {...prev, description: e.target.value} : null
                )}
                placeholder="Description de la formation"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                value={editingCourse?.category || 'video'}
                onChange={(e) => setEditingCourse(prev => 
                  prev ? {...prev, category: e.target.value as "video" | "document" | "external"} : null
                )}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="video">Vidéo</option>
                <option value="document">Document</option>
                <option value="external">Ressource externe</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">URL*</Label>
              <Input
                id="url"
                value={editingCourse?.url || ''}
                onChange={(e) => setEditingCourse(prev => 
                  prev ? {...prev, url: e.target.value} : null
                )}
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
                    onChange={(e) => setEditingCourse(prev => 
                      prev ? {...prev, thumbnail: e.target.value} : null
                    )}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="duration">Durée</Label>
                  <Input
                    id="duration"
                    value={editingCourse?.duration || ''}
                    onChange={(e) => setEditingCourse(prev => 
                      prev ? {...prev, duration: e.target.value} : null
                    )}
                    placeholder="15 min"
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveCourse}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
