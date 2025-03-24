
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Edit, Trash, Plus, Link, Video, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: "video" | "document" | "external";
  url: string;
  thumbnail?: string;
  duration?: string;
  theme?: string;
}

interface TrainingCatalogProps {
  role: string;
}

export const TrainingCatalog: React.FC<TrainingCatalogProps> = ({ role }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  
  const [courses, setCourses] = useState<TrainingCourse[]>([
    {
      id: "1",
      title: "Les bases du live streaming",
      description: "Apprenez comment configurer votre équipement et optimiser votre stream.",
      category: "video",
      url: "https://example.com/video1",
      thumbnail: "/placeholder.svg",
      duration: "15 min",
      theme: "Live TikTok"
    },
    {
      id: "2",
      title: "Guide de l'interface TikTok Live",
      description: "Comprendre et maîtriser l'interface de streaming de TikTok.",
      category: "document",
      url: "https://example.com/doc1",
      theme: "Live TikTok"
    },
    {
      id: "3",
      title: "Interaction avec l'audience",
      description: "Techniques pour engager efficacement votre audience pendant les lives.",
      category: "video",
      url: "https://example.com/video2",
      thumbnail: "/placeholder.svg",
      duration: "22 min",
      theme: "Engagement"
    },
    {
      id: "4",
      title: "Ressources d'auto-formation",
      description: "Liste de ressources externes pour continuer à vous former.",
      category: "external",
      url: "https://www.tiktok.com/creator-center/",
      theme: "Ressources"
    },
    {
      id: "5",
      title: "Optimiser votre contenu TikTok",
      description: "Techniques pour augmenter la visibilité de vos vidéos TikTok.",
      category: "video",
      url: "https://example.com/video3",
      thumbnail: "/placeholder.svg",
      duration: "18 min",
      theme: "Contenu"
    },
    {
      id: "6",
      title: "Utiliser les effets TikTok efficacement",
      description: "Guide complet sur l'utilisation des filtres et effets lors des lives.",
      category: "video",
      url: "https://example.com/video4",
      thumbnail: "/placeholder.svg",
      duration: "12 min",
      theme: "Live TikTok"
    }
  ]);

  const handleAddCourse = () => {
    setEditingCourse({
      id: Date.now().toString(),
      title: "",
      description: "",
      category: activeTab as "video" | "document" | "external",
      url: "",
      theme: "Live TikTok"
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

    const updatedCourses = [...courses];
    const existingIndex = updatedCourses.findIndex(course => course.id === editingCourse.id);
    
    if (existingIndex !== -1) {
      updatedCourses[existingIndex] = editingCourse;
      setCourses(updatedCourses);
      toast.success("Formation mise à jour avec succès");
    } else {
      setCourses([...courses, editingCourse]);
      toast.success("Formation ajoutée avec succès");
    }
    
    setIsEditModalOpen(false);
    setEditingCourse(null);
  };

  // Extract unique themes from courses
  const themes = ["all", ...Array.from(new Set(courses.map(course => course.theme))).filter(Boolean)] as string[];

  // Filter courses by active tab and selected theme
  const filteredCourses = courses.filter(course => {
    const matchesTab = course.category === activeTab;
    const matchesTheme = selectedTheme === "all" || course.theme === selectedTheme;
    return matchesTab && matchesTheme;
  });

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
        <div className="text-sm text-muted-foreground">
          Nos formations sont régulièrement mises à jour pour vous proposer le meilleur contenu.
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="video" className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              Vidéos
            </TabsTrigger>
            <TabsTrigger value="document" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="external" className="flex items-center gap-1">
              <Link className="h-4 w-4" />
              Ressources Externes
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "video" && (
            <div className="flex flex-wrap gap-2 mb-4">
              {themes.map(theme => (
                <Badge 
                  key={theme} 
                  variant={selectedTheme === theme ? "default" : "outline"}
                  className={`cursor-pointer ${selectedTheme === theme ? 'bg-blue-500' : ''}`}
                  onClick={() => setSelectedTheme(theme)}
                >
                  {theme === "all" ? "Toutes les thématiques" : theme}
                </Badge>
              ))}
            </div>
          )}
          
          <TabsContent value="video" className="pt-2">
            <ScrollArea className="h-[450px]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <Card key={course.id} className="overflow-hidden border-blue-100 dark:border-blue-900/20 hover:shadow-md transition-shadow">
                      <div className="relative aspect-video bg-blue-100 dark:bg-blue-900/20">
                        <img 
                          src={course.thumbnail || "/placeholder.svg"} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        {course.duration && (
                          <Badge className="absolute bottom-2 right-2 bg-black/70 text-xs">
                            {course.duration}
                          </Badge>
                        )}
                        {course.theme && (
                          <Badge className="absolute top-2 left-2 bg-blue-500/90 text-xs">
                            {course.theme}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-2">
                        <h3 className="font-medium text-sm line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 h-8">
                          {course.description}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs py-0 h-7"
                            onClick={() => window.open(course.url, '_blank')}
                          >
                            <Video className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          
                          {role === 'founder' && (
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleEditCourse(course)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                    <Sparkles className="h-12 w-12 text-blue-200 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune formation trouvée</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {selectedTheme !== "all" 
                        ? `Aucune formation disponible pour la thématique "${selectedTheme}".` 
                        : "Aucune formation vidéo n'est disponible pour le moment."}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="document" className="pt-2">
            <ScrollArea className="h-[450px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden border-blue-100 dark:border-blue-900/20">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-1.5 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-medium text-sm line-clamp-1">{course.title}</h3>
                            {course.theme && (
                              <Badge variant="outline" className="text-xs whitespace-nowrap">
                                {course.theme}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-2 line-clamp-2 h-8">
                            {course.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs py-0 h-7"
                              onClick={() => window.open(course.url, '_blank')}
                            >
                              Télécharger
                            </Button>
                            
                            {role === 'founder' && (
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
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
          </TabsContent>
          
          <TabsContent value="external" className="pt-2">
            <ScrollArea className="h-[450px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="overflow-hidden border-blue-100 dark:border-blue-900/20">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-1.5 rounded-lg">
                          <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-medium text-sm line-clamp-1">{course.title}</h3>
                            {course.theme && (
                              <Badge variant="outline" className="text-xs whitespace-nowrap">
                                {course.theme}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-2 line-clamp-2 h-8">
                            {course.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs py-0 h-7"
                              onClick={() => window.open(course.url, '_blank')}
                            >
                              Visiter
                            </Button>
                            
                            {role === 'founder' && (
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
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
          </TabsContent>
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
              <Label htmlFor="theme">Thématique</Label>
              <select
                id="theme"
                value={editingCourse?.theme || ''}
                onChange={(e) => setEditingCourse(prev => 
                  prev ? {...prev, theme: e.target.value} : null
                )}
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
