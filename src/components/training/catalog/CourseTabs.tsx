
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
  onViewCourse: (course: TrainingCourse) => void;
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
  onDeleteCourse,
  onViewCourse
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6 bg-slate-100/70 dark:bg-slate-800/70 p-1">
        <TabsTrigger value="video" className="flex items-center gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
          <Video className="h-4 w-4" />
          Vidéos
        </TabsTrigger>
        <TabsTrigger value="document" className="flex items-center gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
          <BookOpen className="h-4 w-4" />
          Documents
        </TabsTrigger>
        <TabsTrigger value="external" className="flex items-center gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
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
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <VideoCourseCard 
                  key={course.id}
                  course={course}
                  role={role}
                  onEdit={onEditCourse}
                  onDelete={onDeleteCourse}
                  onView={onViewCourse}
                />
              ))
            ) : (
              <EmptyState selectedTheme={selectedTheme} />
            )}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="document" className="pt-2">
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCourses.map(course => (
              <DocumentCourseCard 
                key={course.id}
                course={course}
                role={role}
                onEdit={onEditCourse}
                onDelete={onDeleteCourse}
                onView={onViewCourse}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="external" className="pt-2">
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCourses.map(course => (
              <ExternalCourseCard 
                key={course.id}
                course={course}
                role={role}
                onEdit={onEditCourse}
                onDelete={onDeleteCourse}
                onView={onViewCourse}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
