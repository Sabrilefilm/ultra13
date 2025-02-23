
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RGPDModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
          RGPD
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Politique de Protection des Données (RGPD)</DialogTitle>
          <DialogDescription>
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-left">
            <section>
              <h3 className="font-semibold mb-2">1. Introduction</h3>
              <p>
                Cette politique de protection des données explique comment nous collectons, utilisons, 
                partageons et protégeons vos informations personnelles conformément au Règlement Général 
                sur la Protection des Données (RGPD).
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Données collectées</h3>
              <p>Nous collectons les données suivantes :</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Informations de profil (nom d'utilisateur, email)</li>
                <li>Données de connexion</li>
                <li>Informations sur les récompenses et activités</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Utilisation des données</h3>
              <p>Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Gérer votre compte et vos accès</li>
                <li>Assurer le suivi des récompenses</li>
                <li>Améliorer nos services</li>
                <li>Communiquer avec vous concernant votre compte</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Base légale</h3>
              <p>
                Le traitement de vos données personnelles est basé sur :
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Votre consentement</li>
                <li>L'exécution du contrat nous liant</li>
                <li>Nos obligations légales</li>
                <li>Notre intérêt légitime</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">5. Droits des utilisateurs</h3>
              <p>Vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">6. Sécurité des données</h3>
              <p>
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger 
                vos données personnelles contre tout accès, modification, divulgation ou 
                destruction non autorisée.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">7. Conservation des données</h3>
              <p>
                Nous conservons vos données personnelles aussi longtemps que nécessaire 
                pour les finalités pour lesquelles elles ont été collectées, dans le 
                respect des exigences légales et réglementaires.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">8. Contact</h3>
              <p>
                Pour toute question concernant cette politique ou pour exercer vos droits, 
                vous pouvez nous contacter à l'adresse : privacy@example.com
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
