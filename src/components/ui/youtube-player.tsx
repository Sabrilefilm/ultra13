
import React, { useEffect, useState } from "react";

interface YoutubePlayerProps {
  videoUrl: string;
  title?: string;
  description?: string;
  autoplay?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const YoutubePlayer: React.FC<YoutubePlayerProps> = ({
  videoUrl,
  title,
  autoplay = false,
  width = "100%",
  height = "480px",
  className = "",
}) => {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    // Extract YouTube video ID from various URL formats
    const extractVideoId = (url: string): string | null => {
      // Regular YouTube URL (like https://www.youtube.com/watch?v=xxxxxxxxxxx)
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      
      return (match && match[2].length === 11) ? match[2] : null;
    };

    setVideoId(extractVideoId(videoUrl));
  }, [videoUrl]);

  if (!videoId) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <p className="text-gray-500 dark:text-gray-400">Vidéo non disponible</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0`;

  return (
    <div className={className}>
      <iframe
        title={title || "YouTube video player"}
        width={width}
        height={height}
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
        style={{ border: "none" }}
      />
    </div>
  );
};
