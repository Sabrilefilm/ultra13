
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Edit, Trash } from "lucide-react";
import { TrainingCardProps } from "./types";

export const DocumentCourseCard: React.FC<TrainingCardProps> = ({ course, role, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden border-blue-100 dark:border-blue-900/20">
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
                    onClick={() => onEdit(course)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    onClick={() => onDelete(course.id)}
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
  );
};
