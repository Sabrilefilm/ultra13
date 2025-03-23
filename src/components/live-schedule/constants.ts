
// Tableau d'options pour les heures par jour
export const HOURS_OPTIONS = [0, 2, 4, 6, 8, 10, 12];

// Tableau d'options pour les jours par semaine
export const DAYS_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];

// Message pour la mise à jour des heures
export const UPDATE_MESSAGES = {
  success: "Les horaires ont été mis à jour avec succès. Les changements seront effectifs dans les 24-48 heures.",
  error: "Une erreur est survenue lors de la mise à jour des horaires.",
  restricted: "Seul le fondateur peut modifier les horaires de diffusion en direct."
};

// Statuts des horaires
export const SCHEDULE_STATUS = {
  active: "Actif",
  inactive: "Inactif"
};

// Rôles d'utilisateurs
export const USER_ROLES = {
  founder: "Fondateur",
  manager: "Manager",
  agent: "Agent",
  creator: "Créateur",
  ambassador: "Ambassadeur"
};
