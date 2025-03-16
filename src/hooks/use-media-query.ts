
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create MediaQueryList object
    const media = window.matchMedia(query);
    
    // Initial check
    setMatches(media.matches);
    
    // Define listener function
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Add event listener
    media.addEventListener("change", listener);
    
    // Cleanup function
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
