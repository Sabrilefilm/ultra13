
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Sparkles } from "lucide-react";
import { CourseTabs } from "./catalog/CourseTabs";
import { CourseEditModal } from "./catalog/CourseEditModal";
import { VideoPlayerModal } from "./catalog/VideoPlayerModal";
import { useCourseData } from "./catalog/useCourseData";
import { TrainingCatalogProps } from "./catalog/types";

export const TrainingCatalog: React.FC<TrainingCatalogProps> = ({ role }) => {
  const {
    filteredCourses,
    themes,
    activeTab,
    setActiveTab,
    selectedTheme,
    setSelectedTheme,
    isEditModalOpen,
    setIsEditModalOpen,
    isVideoPlayerOpen,
    setIsVideoPlayerOpen,
    editingCourse,
    selectedCourse,
    handleCourseChange,
    handleAddCourse,
    handleEditCourse,
    handleDeleteCourse,
    handleSaveCourse,
    handleViewCourse
  } = useCourseData();

  return (
    <Card className="border-indigo-800/30 shadow-lg overflow-hidden max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-slate-950">
      <CardHeader className="bg-gradient-to-r from-indigo-950/50 to-slate-950/70 pb-6 border-b border-indigo-900/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">Catalogue de Formations ✨</span>
          </div>
          {role === 'founder' && (
            <Button 
              onClick={handleAddCourse} 
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md text-white"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une formation 📚
            </Button>
          )}
        </CardTitle>
        <div className="text-sm text-indigo-300/70 mt-2 flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
          Nos formations sont régulièrement mises à jour pour vous proposer le meilleur contenu.
          Explorez les différentes catégories pour améliorer vos compétences.
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <CourseTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredCourses={filteredCourses}
          themes={themes}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          role={role}
          onEditCourse={handleEditCourse}
          onDeleteCourse={handleDeleteCourse}
          onViewCourse={handleViewCourse}
        />
      </CardContent>
      
      <CourseEditModal 
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editingCourse={editingCourse}
        onCourseChange={handleCourseChange}
        onSave={handleSaveCourse}
      />

      <VideoPlayerModal
        isOpen={isVideoPlayerOpen}
        onOpenChange={setIsVideoPlayerOpen}
        course={selectedCourse}
      />
    </Card>
  );
};
