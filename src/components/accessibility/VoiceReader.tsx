
import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, VolumeX as Mute } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VoiceReaderProps {
  text: string;
  className?: string;
  compact?: boolean;
}

export const VoiceReader: React.FC<VoiceReaderProps> = ({ 
  text, 
  className = "",
  compact = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Get available voices
  const getVoices = () => {
    return speechSynthesis.getVoicesByLang('fr') || 
           speechSynthesis.getVoices().filter(voice => voice.lang.includes('fr'));
  };

  const handlePlay = () => {
    if (!window.speechSynthesis) return;
    
    speechSynthRef.current = window.speechSynthesis;
    
    if (isPlaying) {
      speechSynthRef.current.cancel();
      setIsPlaying(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Set the voice if selected
    if (voice) {
      utterance.voice = voice;
    } else {
      // Try to get a French voice
      const voices = getVoices();
      if (voices.length > 0) {
        utterance.voice = voices[0];
      }
    }
    
    utterance.lang = 'fr-FR';
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    speechSynthRef.current.speak(utterance);
    setIsPlaying(true);
  };
  
  const handleStop = () => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsPlaying(false);
    }
  };
  
  const selectVoice = (selectedVoice: SpeechSynthesisVoice) => {
    setVoice(selectedVoice);
    
    // If currently playing, restart with new voice
    if (isPlaying) {
      handleStop();
      setTimeout(() => {
        handlePlay();
      }, 100);
    }
  };
  
  // Get French voices
  const frenchVoices = typeof window !== 'undefined' && window.speechSynthesis 
    ? getVoices()
    : [];

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePlay}
        className={`h-8 w-8 ${className}`}
        title="Lire le texte à haute voix"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePlay}
        className="flex items-center gap-2"
      >
        {isPlaying ? (
          <>
            <Pause className="h-4 w-4" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            <span>Lire à haute voix</span>
          </>
        )}
      </Button>
      
      {isPlaying && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStop}
          className="ml-1"
        >
          <VolumeX className="h-4 w-4" />
        </Button>
      )}
      
      {frenchVoices.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-1"
            >
              Voix
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {frenchVoices.map((v) => (
              <DropdownMenuItem
                key={v.name}
                onClick={() => selectVoice(v)}
                className={voice?.name === v.name ? "bg-slate-700" : ""}
              >
                {v.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
