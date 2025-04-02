
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ContractInfo {
  username: string;
  role: string;
  userId: string;
}

export const generateContractPDF = (contractInfo: ContractInfo) => {
  const { username, role } = contractInfo;
  
  // Initialize PDF
  const doc = new jsPDF();
  
  // Add Phocéen Agency logo
  // In a real implementation, you would add the logo as an image
  // For now, we'll add text as a placeholder
  doc.setFontSize(20);
  doc.setTextColor(0, 50, 150);
  doc.text("PHOCÉEN AGENCY", 105, 20, { align: "center" });
  
  // Add title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("CONTRAT DE CRÉATEUR PHOCÉEN AGENCY", 105, 40, { align: "center" });
  
  // Add subtitle
  doc.setFontSize(12);
  doc.text(`Entre Phocéen Agency et ${username} (${role})`, 105, 50, { align: "center" });
  
  // Add contract details
  doc.setFontSize(10);
  
  // Article 1
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("1. OBJET DU CONTRAT", 20, 70);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article1Text = 
    `Phocéen Agency propose un programme d'accompagnement destiné aux créateurs de contenu sur les réseaux sociaux. ` +
    `Cet accompagnement inclut la formation à la création de contenu en direct (live streaming), l'aide au développement ` +
    `de l'audience, l'accompagnement pour le placement de produits, et un programme de récompense basé sur les performances. ` +
    `Ce contrat ne constitue ni un CDD, ni un CDI, ni tout autre type de contrat de travail. Il s'agit d'une collaboration ` +
    `basée sur des objectifs et des performances.`;
  
  doc.text(doc.splitTextToSize(article1Text, 170), 20, 80);
  
  // Article 2
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("2. CONDITIONS D'ÉLIGIBILITÉ", 20, 110);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article2Text = 
    `Pour intégrer Phocéen Agency, les critères suivants doivent être remplis : Âge minimum 18 ans, ` +
    `minimum 500 abonnés sur TikTok, autorisation pour les personnes en situation de handicap, ` +
    `posséder un téléphone mobile et WhatsApp, avoir au moins un match off par mois, ` +
    `présentation correcte et tenue respectueuse, interdiction de montrer des enfants mineurs sous une apparence inappropriée.`;
  
  doc.text(doc.splitTextToSize(article2Text, 170), 20, 120);
  
  // Article 3
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("3. RÉMUNÉRATION & PROGRAMME DE RÉCOMPENSES", 20, 140);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article3Text = 
    `La rémunération est basée sur le système "Ultra". Les créateurs sont payés selon : nombre de jours ` +
    `et d'heures de streaming, respect des objectifs, nombre de diamants collectés.`;
  
  doc.text(doc.splitTextToSize(article3Text, 170), 20, 150);
  
  const paymentText = `Modalités de paiement : TikTok (commission de 50%), PayPal (48 à 72 heures), Carte cadeau (3 à 7 jours)`;
  doc.text(doc.splitTextToSize(paymentText, 170), 20, 160);
  
  // Article 4
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("4. ENGAGEMENTS DU CRÉATEUR", 20, 175);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article4Text = 
    `Le Créateur s'engage à respecter les règles TikTok, produire du contenu conforme aux valeurs de l'Agence ` +
    `et se conformer aux exigences de participation.`;
  
  doc.text(doc.splitTextToSize(article4Text, 170), 20, 185);
  
  // Article 5
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("5. RESPONSABILITÉS", 20, 200);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article5Text = 
    `L'Agence n'est pas responsable en cas de harcèlement. Toute menace doit être signalée aux autorités.`;
  
  doc.text(doc.splitTextToSize(article5Text, 170), 20, 210);
  
  // Article 6
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("6. HIÉRARCHIE AU SEIN DE L'AGENCE", 20, 225);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article6Text = 
    `Évolution possible : Agent > Ambassadeur > Manager > Directeur > Fondateur.`;
  
  doc.text(doc.splitTextToSize(article6Text, 170), 20, 235);
  
  // Article 7
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("7. RÉSILIATION", 20, 250);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article7Text = 
    `Le contrat peut être résilié par l'Agence ou le Créateur avec notification écrite. ` +
    `Délai de 30 jours avant départ officiel.`;
  
  doc.text(doc.splitTextToSize(article7Text, 170), 20, 260);
  
  // Contact information
  doc.setFontSize(10);
  doc.text("Contact : contact@phoceenagency.fr", 20, 275);
  
  // Signature fields
  doc.text("Fait à ________________, le ___/___/______", 20, 290);
  doc.text("Signature Phocéen Agency:", 20, 300);
  doc.text("Signature du créateur:", 120, 300);
  
  // Save the PDF
  doc.save(`Contrat_Phoceen_Agency_${username}.pdf`);
};
