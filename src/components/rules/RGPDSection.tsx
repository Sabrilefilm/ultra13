
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export const RGPDSection = () => {
  return (
    <Card className="mb-6 border-indigo-200 dark:border-indigo-800">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
        <div className="flex items-center">
          <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
          <CardTitle>Protection des données (RGPD)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4 text-sm">
          <p>
            <strong>Ultra TikTok Agency</strong> s'engage à respecter la confidentialité de vos données personnelles et à se conformer 
            au Règlement Général sur la Protection des Données (RGPD).
          </p>
          
          <h3 className="font-semibold text-base mt-4">1. Collecte et utilisation des données</h3>
          <p>
            Nous collectons les données suivantes :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Informations d'identification (nom, prénom, email)</li>
            <li>Documents d'identité (pour les vérifications légales)</li>
            <li>Informations relatives aux performances sur TikTok</li>
            <li>Informations nécessaires à la gestion des paiements</li>
          </ul>
          
          <h3 className="font-semibold text-base mt-4">2. Conservation des données</h3>
          <p>
            Vos données sont conservées pour la durée de votre contrat avec l'agence.
            <strong> En cas de départ, vos données sont conservées pendant une période de 1 mois</strong>,
            après quoi vos documents d'identité sont automatiquement supprimés.
          </p>
          
          <h3 className="font-semibold text-base mt-4">3. Sécurité et localisation</h3>
          <p>
            <strong>Toutes vos données sont hébergées en France</strong> dans des centres de données sécurisés
            et conformes aux normes européennes de protection des données.
          </p>
          
          <h3 className="font-semibold text-base mt-4">4. Vos droits</h3>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (dans certaines conditions)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition</li>
          </ul>
          
          <p className="mt-4">
            Pour exercer ces droits ou pour toute question relative à la protection de vos données,
            veuillez contacter notre délégué à la protection des données à l'adresse : contact@ultra-agency.com
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
