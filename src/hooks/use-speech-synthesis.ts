
import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface SpeechSynthesis {
    getVoicesByLang: (lang: string) => SpeechSynthesisVoice[] | null;
  }
}

interface UseSpeechSynthesisProps {
  text: string;
  rate?: number;
  pitch?: number;
  lang?: string;
}

interface UseSpeechSynthesisReturn {
  speak: () => void;
  stop: () => void;
  voices: SpeechSynthesisVoice[];
  isPlaying: boolean;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  selectedVoice: SpeechSynthesisVoice | null;
}

export const useSpeechSynthesis = ({
  text,
  rate = 1,
  pitch = 1,
  lang = 'fr-FR',
}: UseSpeechSynthesisProps): UseSpeechSynthesisReturn => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }
    
    // Add a helper method to get voices by language
    if (!window.speechSynthesis.getVoicesByLang) {
      window.speechSynthesis.getVoicesByLang = (langPrefix: string) => {
        const allVoices = window.speechSynthesis.getVoices();
        const filteredVoices = allVoices.filter(voice => voice.lang.startsWith(langPrefix));
        return filteredVoices.length > 0 ? filteredVoices : null;
      };
    }
    
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Try to find a French voice automatically
      const frenchVoices = availableVoices.filter(voice => voice.lang.startsWith('fr'));
      if (frenchVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(frenchVoices[0]);
      }
    };
    
    loadVoices();
    
    // Chrome needs this event to get voices
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error("SpeechSynthesis not supported");
      return;
    }
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Configure the utterance
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = lang;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Handle events
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      setIsPlaying(false);
    };
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  }, [text, rate, pitch, lang, selectedVoice]);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    speak,
    stop,
    voices,
    isPlaying,
    setVoice,
    selectedVoice,
  };
};
