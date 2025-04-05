
import React from 'react';

export const UserGuide: React.FC = () => {
  return (
    <div className="bg-slate-900/70 backdrop-blur-md border border-purple-800/20 rounded-xl p-6 space-y-6 text-white">
      <h2 className="text-2xl font-bold text-white mb-4">Guide d'utilisation</h2>
      
      <div>
        <h3 className="text-xl text-purple-400 font-semibold mb-2">1. Navigation</h3>
        <p>Utilisez la barre latérale pour naviguer entre les différentes sections de l'application. Sur mobile, utilisez le menu en bas de l'écran ou appuyez sur l'icône de menu pour accéder à toutes les fonctionnalités.</p>
      </div>
      
      <div>
        <h3 className="text-xl text-purple-400 font-semibold mb-2">2. Tableau de bord</h3>
        <p>Le tableau de bord présente un aperçu de vos statistiques, activités récentes et prochains matchs. Les cartes interactives vous permettent d'accéder rapidement aux informations importantes.</p>
      </div>
      
      <div>
        <h3 className="text-xl text-purple-400 font-semibold mb-2">3. Gestion des matchs</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Créez un match en cliquant sur "Programmer un match"</li>
          <li>Définissez le gagnant après un match en cliquant sur le bouton portant le nom du créateur</li>
          <li>Ajoutez des points au créateur gagnant</li>
          <li>Téléchargez l'image du match pour la partager</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl text-purple-400 font-semibold mb-2">4. Gestion des utilisateurs</h3>
        <p>Les administrateurs peuvent créer de nouveaux comptes, attribuer des rôles et surveiller l'activité des utilisateurs depuis la section "Gestion des utilisateurs".</p>
      </div>
      
      <div>
        <h3 className="text-xl text-purple-400 font-semibold mb-2">5. Système de diamants</h3>
        <p>Les diamants sont attribués aux créateurs selon leur performance. Le compteur de diamants se réinitialise chaque mois. Les créateurs peuvent suivre leur progression mensuelle dans leur tableau de bord.</p>
      </div>
      
      <div>
        <h3 className="text-xl text-purple-400 font-semibold mb-2">6. Planification des directs</h3>
        <p>Utilisez le calendrier pour planifier vos diffusions en direct. Assurez-vous de respecter votre quota hebdomadaire d'heures et de jours pour optimiser vos récompenses.</p>
      </div>
      
      <div>
        <h3 className="text-xl text-purple-400 font-semibold mb-2">7. Contrat</h3>
        <p>Vous pouvez consulter et télécharger votre contrat à tout moment. Une fois que vous avez lu le contrat, cliquez sur "J'approuve le contrat" pour confirmer votre accord.</p>
      </div>
      
      <div>
        <h3 className="text-xl text-purple-400 font-semibold mb-2">8. Support</h3>
        <p>Pour toute question ou assistance, contactez un administrateur via la messagerie interne ou par email à support@ultras-agency.com</p>
      </div>
      
      <div className="border-t border-purple-800/30 pt-4 mt-8">
        <p className="text-slate-400 italic">Ce guide est régulièrement mis à jour pour refléter les nouvelles fonctionnalités et améliorations de l'application.</p>
      </div>
    </div>
  );
};
