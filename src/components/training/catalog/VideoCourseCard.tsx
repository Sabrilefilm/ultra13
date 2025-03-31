
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Play, ExternalLink } from "lucide-react";
import { TrainingCardProps } from "./types";

export const VideoCourseCard: React.FC<TrainingCardProps> = ({ course, role, onEdit, onDelete, onView }) => {
  return (
    <Card className="overflow-hidden border-blue-100 dark:border-blue-900/20 hover:shadow-md transition-shadow group">
      <div 
        className="relative aspect-video bg-blue-100 dark:bg-blue-900/20 cursor-pointer overflow-hidden"
        onClick={() => onView(course)}
      >
        <img 
          src={course.thumbnail || "/placeholder.svg"} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
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
      <CardContent className="p-4">
        <h3 className="font-medium text-sm line-clamp-1 mb-1">{course.title}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 h-8 mb-3">
          {course.description}
        </p>
        <div className="flex justify-between items-center mt-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="text-xs py-0 h-7"
            onClick={() => onView(course)}
          >
            <Play className="h-3 w-3 mr-1" />
            Regarder
          </Button>
          
          {role === 'founder' && (
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(course);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(course.id);
                }}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
