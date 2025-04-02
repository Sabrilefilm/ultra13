
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
  doc.text("CONTRAT DE COLLABORATION", 105, 40, { align: "center" });
  
  // Add subtitle
  doc.setFontSize(12);
  doc.text(`Entre Ultra Agency et ${username} (${role})`, 105, 50, { align: "center" });
  
  // Add contract details
  doc.setFontSize(10);
  
  // Article 1
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Article 1 - Objet du Contrat", 20, 70);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article1Text = 
    `Ce contrat définit les conditions de collaboration entre Ultra Agency et le ${role.toLowerCase()}. ` +
    `Cette collaboration vise à promouvoir le développement professionnel du ${role.toLowerCase()} sur ` +
    `la plateforme TikTok tout en respectant les directives et objectifs fixés par Ultra Agency.`;
  
  doc.text(doc.splitTextToSize(article1Text, 170), 20, 80);
  
  // Article 2
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Article 2 - Rémunération", 20, 110);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article2Text = 
    `Le ${role.toLowerCase()} sera rémunéré selon le programme de récompenses basé sur les diamants. ` +
    `Le paiement sera effectué une fois le seuil minimum atteint, conformément au Programme de Récompenses en vigueur.`;
  
  doc.text(doc.splitTextToSize(article2Text, 170), 20, 120);
  
  // Programme de Récompenses
  autoTable(doc, {
    startY: 135,
    head: [["Diamants", "Récompense"]],
    body: [
      ["36,000 diamants", "10€"],
      ["100,000 diamants", "30€"],
      ["300,000 diamants", "100€"],
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 5 },
    headStyles: { fillColor: [100, 50, 150] },
  });
  
  // Article 3
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Article 3 - Obligations", 20, 180);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article3Text = `Le ${role.toLowerCase()} s'engage à :`;
  doc.text(article3Text, 20, 190);
  
  // List of obligations
  const obligations = [
    "• Effectuer 7 jours et 15 heures de live par semaine",
    "• Respecter le règlement intérieur d'Ultra Agency",
    "• Maintenir une image professionnelle sur la plateforme",
    "• Participer aux événements organisés par Ultra Agency",
    "• Informer l'agence de tout problème ou difficulté"
  ];
  
  doc.text(obligations, 25, 200);
  
  // Article 4
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Article 4 - Durée", 20, 230);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const article4Text = 
    `Ce contrat est conclu pour une durée indéterminée, avec possibilité de résiliation par l'une ou ` +
    `l'autre des parties moyennant un préavis d'une semaine.`;
  
  doc.text(doc.splitTextToSize(article4Text, 170), 20, 240);
  
  // Article 5
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Article 5 - Informations de l'Agence", 20, 260);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const agencyInfo = [
    "Phocéen Agency",
    "Adresse: 16 Rue Fort Notre Dame, 13001 Marseille",
    "Email: contact@phoceenagency.fr",
    "Site web: https://phoceenagency.fr"
  ];
  
  doc.text(agencyInfo, 20, 270);
  
  // Signature fields
  doc.setFontSize(10);
  doc.text("Date: __________________", 20, 290);
  doc.text("Signature du créateur:", 20, 300);
  doc.text("Signature de l'agence:", 120, 300);
  
  // Save the PDF
  doc.save(`Contrat_Ultra_Agency_${username}.pdf`);
};
