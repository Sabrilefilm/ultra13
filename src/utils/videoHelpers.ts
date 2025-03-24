
/**
 * Extrait l'ID d'une vidéo YouTube à partir de son URL
 * Supporte les formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export const getYoutubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Regex pour extraire l'ID de différents formats d'URL YouTube
  const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};
