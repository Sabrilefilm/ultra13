import React from 'react';

interface ContractDocumentProps {
  username: string;
  role: string;
  date: string;
}

export const ContractDocument: React.FC<ContractDocumentProps> = ({
  username,
  role,
  date
}) => {
  // Différentes versions de contrat selon le rôle
  const renderCreatorContract = () => (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold text-center">CONTRAT DE PARTENARIAT CRÉATEUR</h1>
      
      <div className="text-center">
        <p>Entre :</p>
        <p className="font-semibold">L'Agence ULTRAS</p>
        <p>ci-après désignée "L'AGENCE"</p>
        <p>Et :</p>
        <p className="font-semibold">{username}</p>
        <p>agissant en qualité de Créateur de contenu</p>
        <p>ci-après désigné "LE CRÉATEUR"</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">1. OBJET DU CONTRAT</h2>
        <p className="mb-2">Le présent contrat a pour objet de définir les conditions et modalités selon lesquelles le CRÉATEUR s'engage à collaborer avec l'AGENCE pour la création, la promotion et le développement de contenu sur diverses plateformes numériques.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">2. ENGAGEMENTS DU CRÉATEUR</h2>
        <p className="mb-2">Le CRÉATEUR s'engage à :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Créer et publier du contenu original sur les plateformes convenues avec l'AGENCE.</li>
          <li>Respecter le calendrier de publication établi en concertation avec l'AGENCE.</li>
          <li>Participer aux événements organisés par l'AGENCE pour promouvoir sa chaîne.</li>
          <li>Maintenir une image de marque positive et professionnelle.</li>
          <li>Informer l'AGENCE de toute opportunité ou partenariat extérieur.</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">3. ENGAGEMENTS DE L'AGENCE</h2>
        <p className="mb-2">L'AGENCE s'engage à :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Accompagner le CRÉATEUR dans sa stratégie de création de contenu.</li>
          <li>Fournir un support technique et créatif au CRÉATEUR.</li>
          <li>Promouvoir le contenu du CRÉATEUR sur ses différents canaux.</li>
          <li>Négocier des partenariats commerciaux au bénéfice du CRÉATEUR.</li>
          <li>Verser au CRÉATEUR les rémunérations convenues selon les modalités prévues.</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">4. DURÉE DU CONTRAT</h2>
        <p className="mb-2">Le contrat est conclu pour une durée de 12 mois à compter de sa signature. Il sera renouvelé tacitement par périodes successives de même durée, sauf dénonciation par l'une des parties notifiée par écrit au moins 1 mois avant l'échéance.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">5. RÉMUNÉRATION</h2>
        <p className="mb-2">Le CRÉATEUR percevra une rémunération selon les termes suivants :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Un pourcentage des revenus générés par son contenu selon le barème établi.</li>
          <li>Des bonus en fonction de l'atteinte d'objectifs définis conjointement.</li>
          <li>Une compensation pour les événements et promotions spéciales.</li>
        </ul>
        <p className="mb-2">Le paiement sera effectué mensuellement sur présentation de facture.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">6. EXCLUSIVITÉ</h2>
        <p className="mb-2">Pendant la durée du contrat, le CRÉATEUR s'engage à ne pas collaborer avec des entités concurrentes de l'AGENCE sans accord préalable écrit. L'AGENCE conserve le droit de travailler avec d'autres créateurs de contenu.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">7. CONFIDENTIALITÉ</h2>
        <p className="mb-2">Les parties s'engagent à maintenir confidentielles toutes les informations commerciales, techniques ou financières échangées dans le cadre de ce contrat, pendant toute sa durée et pour une période de 2 ans après sa résiliation.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">8. PROPRIÉTÉ INTELLECTUELLE</h2>
        <p className="mb-2">Le CRÉATEUR conserve les droits d'auteur sur son contenu. Cependant, il accorde à l'AGENCE une licence non exclusive pour utiliser, reproduire et distribuer ce contenu à des fins promotionnelles.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">9. RÉSILIATION</h2>
        <p className="mb-2">Chaque partie peut résilier le contrat en cas de manquement grave par l'autre partie à ses obligations, après mise en demeure restée sans effet pendant 15 jours. La résiliation n'affecte pas les droits acquis avant celle-ci.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">10. OBLIGATIONS DE PERFORMANCE</h2>
        <p className="mb-2">Le CRÉATEUR s'engage à maintenir des standards de qualité définis pour son contenu. L'AGENCE se réserve le droit de demander des modifications en cas de non-conformité.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">11. RESPONSABILITÉ</h2>
        <p className="mb-2">Chaque partie est responsable de ses propres actes et contenus. Le CRÉATEUR garantit détenir tous les droits nécessaires sur le contenu qu'il produit.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">12. ASSURANCE</h2>
        <p className="mb-2">Les parties s'engagent à souscrire les assurances nécessaires pour couvrir les risques liés à leurs activités respectives.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">13. MODIFICATION</h2>
        <p className="mb-2">Toute modification du présent contrat doit faire l'objet d'un avenant écrit signé par les deux parties.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">14. RÈGLEMENT DES LITIGES</h2>
        <p className="mb-2">En cas de litige relatif à l'interprétation ou à l'exécution du présent contrat, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera soumis aux tribunaux compétents.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">15. DISPOSITIONS FINALES</h2>
        <p className="mb-2">Le présent contrat constitue l'intégralité de l'accord entre les parties concernant son objet. Il annule et remplace tout accord antérieur.</p>
      </div>
      
      <div className="mt-8 text-center">
        <p>Fait à Marseille, le {date}</p>
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <p className="font-semibold">Pour l'AGENCE :</p>
            <p className="mt-8">Signature</p>
          </div>
          <div>
            <p className="font-semibold">Le CRÉATEUR :</p>
            <p>{username}</p>
            <p className="mt-8">Signature</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgentContract = () => (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold text-center">CONTRAT D'AGENT</h1>
      
      <div className="text-center">
        <p>Entre :</p>
        <p className="font-semibold">L'Agence ULTRAS</p>
        <p>ci-après désignée "L'AGENCE"</p>
        <p>Et :</p>
        <p className="font-semibold">{username}</p>
        <p>agissant en qualité d'Agent</p>
        <p>ci-après désigné "L'AGENT"</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">1. OBJET DU CONTRAT</h2>
        <p className="mb-2">Le présent contrat a pour objet de définir les conditions et modalités selon lesquelles l'AGENT s'engage à représenter l'AGENCE auprès des créateurs de contenu et à gérer les relations avec les talents sous sa responsabilité.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">2. ENGAGEMENTS DE L'AGENT</h2>
        <p className="mb-2">L'AGENT s'engage à :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Représenter l'AGENCE auprès des créateurs sous sa responsabilité.</li>
          <li>Suivre l'évolution des performances des créateurs et les accompagner.</li>
          <li>Participer aux réunions d'équipe et aux événements organisés par l'AGENCE.</li>
          <li>Maintenir une relation professionnelle avec les créateurs.</li>
          <li>Identifier de nouveaux talents potentiels pour l'AGENCE.</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">3. ENGAGEMENTS DE L'AGENCE</h2>
        <p className="mb-2">L'AGENCE s'engage à :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Fournir les outils et ressources nécessaires à l'AGENT.</li>
          <li>Assurer la formation continue de l'AGENT.</li>
          <li>Verser à l'AGENT les rémunérations convenues selon les modalités prévues.</li>
          <li>Soutenir l'AGENT dans ses démarches de représentation.</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">4. DURÉE DU CONTRAT</h2>
        <p className="mb-2">Le contrat est conclu pour une durée indéterminée à compter de sa signature, avec une période d'essai de 3 mois.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">5. RÉMUNÉRATION</h2>
        <p className="mb-2">L'AGENT percevra une rémunération selon les termes suivants :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Un salaire fixe mensuel selon les conditions convenues.</li>
          <li>Des commissions sur les performances des créateurs sous sa responsabilité.</li>
          <li>Des primes en fonction de l'atteinte d'objectifs définis.</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">6. EXCLUSIVITÉ</h2>
        <p className="mb-2">Pendant la durée du contrat, l'AGENT s'engage à ne pas représenter d'autres agences ou créateurs sans l'accord préalable de l'AGENCE.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">7. CONFIDENTIALITÉ</h2>
        <p className="mb-2">Les parties s'engagent à maintenir confidentielles toutes les informations commerciales, techniques ou financières échangées dans le cadre de ce contrat, pendant toute sa durée et pour une période de 2 ans après sa résiliation.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">8. PROPRIÉTÉ INTELLECTUELLE</h2>
        <p className="mb-2">L'AGENCE conserve la propriété intellectuelle des outils et ressources mis à disposition de l'AGENT. L'AGENT s'engage à ne pas les divulguer ou les utiliser à des fins autres que celles prévues par le présent contrat.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">9. RÉSILIATION</h2>
        <p className="mb-2">Chaque partie peut résilier le contrat en respectant un préavis de 1 mois. En cas de faute grave, la résiliation peut être immédiate.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">10. OBLIGATIONS DE PERFORMANCE</h2>
        <p className="mb-2">L'AGENT s'engage à atteindre les objectifs de performance définis par l'AGENCE. En cas de non-respect répété de ces objectifs, l'AGENCE se réserve le droit de résilier le contrat.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">11. RESPONSABILITÉ</h2>
        <p className="mb-2">Chaque partie est responsable de ses propres actes et contenus. L'AGENT garantit détenir toutes les autorisations nécessaires pour représenter les créateurs auprès de l'AGENCE.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">12. ASSURANCE</h2>
        <p className="mb-2">Les parties s'engagent à souscrire les assurances nécessaires pour couvrir les risques liés à leurs activités respectives.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">13. MODIFICATION</h2>
        <p className="mb-2">Toute modification du présent contrat doit faire l'objet d'un avenant écrit signé par les deux parties.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">14. RÈGLEMENT DES LITIGES</h2>
        <p className="mb-2">En cas de litige relatif à l'interprétation ou à l'exécution du présent contrat, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera soumis aux tribunaux compétents.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">15. DISPOSITIONS FINALES</h2>
        <p className="mb-2">Le présent contrat constitue l'intégralité de l'accord entre les parties concernant son objet. Il annule et remplace tout accord antérieur.</p>
      </div>
      
      <div className="mt-8 text-center">
        <p>Fait à Marseille, le {date}</p>
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <p className="font-semibold">Pour l'AGENCE :</p>
            <p className="mt-8">Signature</p>
          </div>
          <div>
            <p className="font-semibold">L'AGENT :</p>
            <p>{username}</p>
            <p className="mt-8">Signature</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManagerContract = () => (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold text-center">CONTRAT DE MANAGER</h1>
      
      <div className="text-center">
        <p>Entre :</p>
        <p className="font-semibold">L'Agence ULTRAS</p>
        <p>ci-après désignée "L'AGENCE"</p>
        <p>Et :</p>
        <p className="font-semibold">{username}</p>
        <p>agissant en qualité de Manager</p>
        <p>ci-après désigné "LE MANAGER"</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">1. OBJET DU CONTRAT</h2>
        <p className="mb-2">Le présent contrat a pour objet de définir les conditions et modalités selon lesquelles le MANAGER s'engage à gérer une équipe d'agents et à superviser les opérations de l'AGENCE dans son domaine de responsabilité.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">2. ENGAGEMENTS DU MANAGER</h2>
        <p className="mb-2">LE MANAGER s'engage à :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Superviser et former l'équipe d'agents sous sa responsabilité.</li>
          <li>Développer des stratégies pour améliorer les performances des créateurs.</li>
          <li>Représenter l'AGENCE dans les négociations importantes.</li>
          <li>Assurer le suivi des objectifs commerciaux et qualitatifs.</li>
          <li>Participer aux décisions stratégiques de l'AGENCE.</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">3. ENGAGEMENTS DE L'AGENCE</h2>
        <p className="mb-2">L'AGENCE s'engage à :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Fournir les moyens nécessaires à l'exécution des missions du MANAGER.</li>
          <li>Consulter le MANAGER pour les décisions stratégiques concernant son équipe.</li>
          <li>Verser au MANAGER les rémunérations convenues selon les modalités prévues.</li>
          <li>Assurer le développement professionnel du MANAGER.</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">4. DURÉE DU CONTRAT</h2>
        <p className="mb-2">Le contrat est conclu pour une durée indéterminée à compter de sa signature.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">5. RÉMUNÉRATION</h2>
        <p className="mb-2">LE MANAGER percevra une rémunération selon les termes suivants :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Un salaire fixe mensuel selon les conditions convenues.</li>
          <li>Des bonus basés sur les performances de son équipe d'agents.</li>
          <li>Une participation aux résultats de l'AGENCE selon les modalités définies.</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">6. EXCLUSIVITÉ</h2>
        <p className="mb-2">Le MANAGER s'engage à consacrer la majorité de son temps de travail à l'AGENCE et à ne pas exercer d'activités concurrentes sans son accord préalable.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">7. CONFIDENTIALITÉ</h2>
        <p className="mb-2">Les parties s'engagent à maintenir confidentielles toutes les informations commerciales, techniques ou financières échangées dans le cadre de ce contrat, pendant toute sa durée et pour une période de 2 ans après sa résiliation.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">8. PROPRIÉTÉ INTELLECTUELLE</h2>
        <p className="mb-2">L'AGENCE conserve la propriété intellectuelle des outils et ressources mis à disposition du MANAGER. Le MANAGER s'engage à ne pas les divulguer ou les utiliser à des fins autres que celles prévues par le présent contrat.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">9. RÉSILIATION</h2>
        <p className="mb-2">Chaque partie peut résilier le contrat en respectant un préavis de 3 mois. En cas de faute grave, la résiliation peut être immédiate.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">10. OBLIGATIONS DE PERFORMANCE</h2>
        <p className="mb-2">Le MANAGER s'engage à atteindre les objectifs de performance définis par l'AGENCE. En cas de non-respect répété de ces objectifs, l'AGENCE se réserve le droit de résilier le contrat.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">11. RESPONSABILITÉ</h2>
        <p className="mb-2">Chaque partie est responsable de ses propres actes et contenus. Le MANAGER garantit détenir toutes les autorisations nécessaires pour représenter l'AGENCE auprès des tiers.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">12. ASSURANCE</h2>
        <p className="mb-2">Les parties s'engagent à souscrire les assurances nécessaires pour couvrir les risques liés à leurs activités respectives.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">13. MODIFICATION</h2>
        <p className="mb-2">Toute modification du présent contrat doit faire l'objet d'un avenant écrit signé par les deux parties.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">14. RÈGLEMENT DES LITIGES</h2>
        <p className="mb-2">En cas de litige relatif à l'interprétation ou à l'exécution du présent contrat, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera soumis aux tribunaux compétents.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">15. DISPOSITIONS FINALES</h2>
        <p className="mb-2">Le présent contrat constitue l'intégralité de l'accord entre les parties concernant son objet. Il annule et remplace tout accord antérieur.</p>
      </div>
      
      <div className="mt-8 text-center">
        <p>Fait à Marseille, le {date}</p>
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <p className="font-semibold">Pour l'AGENCE :</p>
            <p className="mt-8">Signature</p>
          </div>
          <div>
            <p className="font-semibold">LE MANAGER :</p>
            <p>{username}</p>
            <p className="mt-8">Signature</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDefaultContract = () => (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold text-center">CONTRAT DE PARTENARIAT</h1>
      
      <div className="text-center">
        <p>Entre :</p>
        <p className="font-semibold">L'Agence ULTRAS</p>
        <p>ci-après désignée "L'AGENCE"</p>
        <p>Et :</p>
        <p className="font-semibold">{username}</p>
        <p>agissant en qualité de {role === 'creator' ? 'Créateur de contenu' : role}</p>
        <p>ci-après désigné "LE PARTENAIRE"</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">1. OBJET DU CONTRAT</h2>
        <p className="mb-2">Le présent contrat a pour objet de définir les conditions et modalités selon lesquelles le PARTENAIRE s'engage à collaborer avec l'AGENCE pour la création, la promotion et le développement de contenu sur diverses plateformes numériques.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">2. ENGAGEMENTS DU PARTENAIRE</h2>
        <p className="mb-2">Le PARTENAIRE s'engage à :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Créer et publier du contenu original sur les plateformes convenues avec l'AGENCE.</li>
          <li>Respecter le calendrier de publication établi en concertation avec l'AGENCE.</li>
          <li>Participer aux promotions et événements organisés par l'AGENCE.</li>
          <li>Maintenir une image de marque positive et professionnelle.</li>
          <li>Informer l'AGENCE de toute opportunité ou partenariat extérieur.</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">3. ENGAGEMENTS DE L'AGENCE</h2>
        <p className="mb-2">L'AGENCE s'engage à :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Accompagner le PARTENAIRE dans sa stratégie de création de contenu.</li>
          <li>Fournir un support technique et créatif au PARTENAIRE.</li>
          <li>Promouvoir le contenu du PARTENAIRE sur ses différents canaux.</li>
          <li>Négocier des partenariats commerciaux au bénéfice du PARTENAIRE.</li>
          <li>Verser au PARTENAIRE les rémunérations convenues selon les modalités prévues.</li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">4. DURÉE DU CONTRAT</h2>
        <p className="mb-2">Le contrat est conclu pour une durée de 12 mois à compter de sa signature. Il sera renouvelé tacitement par périodes successives de même durée, sauf dénonciation par l'une des parties notifiée par écrit au moins 1 mois avant l'échéance.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">5. RÉMUNÉRATION</h2>
        <p className="mb-2">Le PARTENAIRE percevra une rémunération selon les termes suivants :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Un pourcentage des revenus générés par son contenu selon le barème établi.</li>
          <li>Des bonus en fonction de l'atteinte d'objectifs définis conjointement.</li>
          <li>Une compensation pour les événements et promotions spéciales.</li>
        </ul>
        <p className="mb-2">Le paiement sera effectué mensuellement sur présentation de facture.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">6. EXCLUSIVITÉ</h2>
        <p className="mb-2">Pendant la durée du contrat, le PARTENAIRE s'engage à ne pas collaborer avec des entités concurrentes de l'AGENCE sans accord préalable écrit. L'AGENCE conserve le droit de travailler avec d'autres créateurs de contenu.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">7. CONFIDENTIALITÉ</h2>
        <p className="mb-2">Les parties s'engagent à maintenir confidentielles toutes les informations commerciales, techniques ou financières échangées dans le cadre de ce contrat, pendant toute sa durée et pour une période de 2 ans après sa résiliation.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">8. PROPRIÉTÉ INTELLECTUELLE</h2>
        <p className="mb-2">Le PARTENAIRE conserve les droits d'auteur sur son contenu. Cependant, il accorde à l'AGENCE une licence non exclusive pour utiliser, reproduire et distribuer ce contenu à des fins promotionnelles.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">9. RÉSILIATION</h2>
        <p className="mb-2">Chaque partie peut résilier le contrat en cas de manquement grave par l'autre partie à ses obligations, après mise en demeure restée sans effet pendant 15 jours. La résiliation n'affecte pas les droits acquis avant celle-ci.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">10. OBLIGATIONS DE PERFORMANCE</h2>
        <p className="mb-2">Le PARTENAIRE s'engage à maintenir des standards de qualité définis pour son contenu. L'AGENCE se réserve le droit de demander des modifications en cas de non-conformité.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">11. RESPONSABILITÉ</h2>
        <p className="mb-2">Chaque partie est responsable de ses propres actes et contenus. Le PARTENAIRE garantit détenir tous les droits nécessaires sur le contenu qu'il produit.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">12. ASSURANCE</h2>
        <p className="mb-2">Les parties s'engagent à souscrire les assurances nécessaires pour couvrir les risques liés à leurs activités respectives.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">13. MODIFICATION</h2>
        <p className="mb-2">Toute modification du présent contrat doit faire l'objet d'un avenant écrit signé par les deux parties.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">14. RÈGLEMENT DES LITIGES</h2>
        <p className="mb-2">En cas de litige relatif à l'interprétation ou à l'exécution du présent contrat, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera soumis aux tribunaux compétents.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">15. DISPOSITIONS FINALES</h2>
        <p className="mb-2">Le présent contrat constitue l'intégralité de l'accord entre les parties concernant son objet. Il annule et remplace tout accord antérieur.</p>
      </div>
      
      <div className="mt-8 text-center">
        <p>Fait à Marseille, le {date}</p>
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <p className="font-semibold">Pour l'AGENCE :</p>
            <p className="mt-8">Signature</p>
          </div>
          <div>
            <p className="font-semibold">Le PARTENAIRE :</p>
            <p>{username}</p>
            <p className="mt-8">Signature</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Afficher le contrat approprié selon le rôle
  switch(role) {
    case 'creator':
      return renderCreatorContract();
    case 'agent':
      return renderAgentContract();
    case 'manager':
      return renderManagerContract();
    default:
      return renderDefaultContract();
  }
};
