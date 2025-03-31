
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, Edit, Trash, ExternalLink } from "lucide-react";
import { TrainingCardProps } from "./types";

export const ExternalCourseCard: React.FC<TrainingCardProps> = ({ course, role, onEdit, onDelete, onView }) => {
  return (
    <Card className="overflow-hidden border-blue-100 dark:border-blue-900/20 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-900/30 dark:to-purple-800/20 p-3 rounded-lg">
            <Link className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-1 mb-2">
              <h3 className="font-medium text-base line-clamp-1">{course.title}</h3>
              {course.theme && (
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {course.theme}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {course.description}
            </p>
            <div className="flex justify-between items-center">
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-xs py-0 h-8"
                onClick={() => window.open(course.url, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Visiter le site
              </Button>
              
              {role === 'founder' && (
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onEdit(course)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
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
