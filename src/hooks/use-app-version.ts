
import { useState, useEffect } from 'react';

export function useAppVersion() {
  const [version, setVersion] = useState(() => {
    return localStorage.getItem('app_version') || '1.0';
  });

  // Sauvegarde de la version dans le localStorage
  useEffect(() => {
    localStorage.setItem('app_version', version);
  }, [version]);

  const updateVersion = (newVersion: string) => {
    setVersion(newVersion);
  };

  return {
    version,
    updateVersion
  };
}
