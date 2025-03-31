
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoPlayerModalProps } from "./types";
import { YoutubePlayer } from "@/components/ui/youtube-player";
import { CalendarClock, ExternalLink, Play } from "lucide-react";

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onOpenChange,
  course
}) => {
  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-blue-200 dark:border-blue-900/50">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Play className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            {course.title}
            {course.duration && (
              <span className="flex items-center text-sm font-normal text-muted-foreground ml-2">
                <CalendarClock className="h-4 w-4 mr-1" /> {course.duration}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-base mt-1">
            {course.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="rounded-lg overflow-hidden shadow-lg border border-blue-100 dark:border-blue-900/20">
            <YoutubePlayer 
              videoUrl={course.url}
              title={course.title}
              description={course.description}
              autoplay={true}
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex-1 text-left">
            {course.theme && (
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                {course.theme}
              </span>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.open(course.url, '_blank')}
            className="sm:ml-auto border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Voir sur la plateforme d'origine
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
