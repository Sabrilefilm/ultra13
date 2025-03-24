
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { getYoutubeVideoId } from "@/utils/videoHelpers";

interface YoutubePlayerProps {
  videoUrl: string;
  title?: string;
  description?: string;
  autoplay?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const YoutubePlayer: React.FC<YoutubePlayerProps> = ({
  videoUrl,
  title,
  description,
  autoplay = false,
  onComplete,
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  
  const videoId = getYoutubeVideoId(videoUrl);
  
  useEffect(() => {
    if (autoplay) {
      setShowPreview(false);
    }
    
    // Simulate loading effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [autoplay]);
  
  const handlePlay = () => {
    setIsPlaying(true);
    setShowPreview(false);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    const iframe = document.getElementById('youtube-player-iframe') as HTMLIFrameElement;
    if (iframe) {
      if (!isFullscreen) {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        }
      }
    }
  };
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const playButtonAnimation = {
    scale: [1, 1.2, 1],
    boxShadow: [
      "0 0 0 0 rgba(255, 255, 255, 0)",
      "0 0 0 10px rgba(255, 255, 255, 0.3)",
      "0 0 0 0 rgba(255, 255, 255, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      
      <CardContent className="p-0 relative">
        {!isLoaded ? (
          <div className="relative aspect-video bg-slate-900">
            <Skeleton className="w-full h-full absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video">
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  className="absolute inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={handlePlay}
                >
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={title || "Video thumbnail"}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <motion.div
                    className="relative z-20 bg-white bg-opacity-20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center"
                    animate={playButtonAnimation}
                  >
                    <Play className="h-10 w-10 text-white" />
                  </motion.div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold drop-shadow-lg">{title}</h3>
                    {description && (
                      <p className="text-sm opacity-80 drop-shadow-md line-clamp-2 mt-1">{description}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <iframe 
              id="youtube-player-iframe"
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&enablejsapi=1`}
              title={title || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={`absolute inset-0 ${showPreview ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            ></iframe>
            
            {!showPreview && (
              <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={isPlaying ? handlePause : handlePlay}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={toggleFullscreen}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-white hover:bg-white/20"
                    onClick={handleComplete}
                  >
                    <Check className="h-4 w-4 mr-1" /> Marquer comme vu
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {!showPreview && (title || description) && (
        <CardFooter className="flex justify-between items-center py-3">
          {(title || description) && (
            <div className="text-sm">
              <p className="font-medium">{title}</p>
              {description && <p className="text-muted-foreground line-clamp-1">{description}</p>}
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/20"
            onClick={() => window.open(videoUrl, '_blank')}
          >
            Voir sur YouTube <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
