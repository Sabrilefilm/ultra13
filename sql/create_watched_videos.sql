
-- Table de suivi des vidéos visionnées
CREATE TABLE watched_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Contrainte unique pour éviter les doublons
  UNIQUE(user_id, training_id)
);

-- Indexes pour améliorer les performances
CREATE INDEX idx_watched_videos_user ON watched_videos(user_id);
CREATE INDEX idx_watched_videos_training ON watched_videos(training_id);
