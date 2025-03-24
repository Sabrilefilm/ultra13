
import React from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Video, BookOpen, Link } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoCourseCard } from "./VideoCourseCard";
import { DocumentCourseCard } from "./DocumentCourseCard";
import { ExternalCourseCard } from "./ExternalCourseCard";
import { ThemeFilter } from "./ThemeFilter";
import { EmptyState } from "./EmptyState";
import { TrainingCourse } from "./types";

interface CourseTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredCourses: TrainingCourse[];
  themes: string[];
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  role: string;
  onEditCourse: (course: TrainingCourse) => void;
  onDeleteCourse: (id: string) => void;
}

export const CourseTabs: React.FC<CourseTabsProps> = ({
  activeTab,
  setActiveTab,
  filteredCourses,
  themes,
  selectedTheme,
  setSelectedTheme,
  role,
  onEditCourse,
  onDeleteCourse
}) => {
  return (
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
        <ThemeFilter 
          themes={themes} 
          selectedTheme={selectedTheme} 
          onThemeSelect={setSelectedTheme} 
        />
      )}
      
      <TabsContent value="video" className="pt-2">
        <ScrollArea className="h-[450px]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <VideoCourseCard 
                  key={course.id}
                  course={course}
                  role={role}
                  onEdit={onEditCourse}
                  onDelete={onDeleteCourse}
                />
              ))
            ) : (
              <EmptyState selectedTheme={selectedTheme} />
            )}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="document" className="pt-2">
        <ScrollArea className="h-[450px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCourses.map(course => (
              <DocumentCourseCard 
                key={course.id}
                course={course}
                role={role}
                onEdit={onEditCourse}
                onDelete={onDeleteCourse}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="external" className="pt-2">
        <ScrollArea className="h-[450px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCourses.map(course => (
              <ExternalCourseCard 
                key={course.id}
                course={course}
                role={role}
                onEdit={onEditCourse}
                onDelete={onDeleteCourse}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
