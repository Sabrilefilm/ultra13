
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
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
    <Card className="border-blue-200 dark:border-blue-900/30 shadow-md overflow-hidden max-w-5xl mx-auto bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-slate-900 pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <span className="text-xl md:text-2xl font-bold">Catalogue de Formations</span>
          </div>
          {role === 'founder' && (
            <Button 
              onClick={handleAddCourse} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une formation
            </Button>
          )}
        </CardTitle>
        <div className="text-sm text-muted-foreground mt-2">
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
