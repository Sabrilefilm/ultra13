
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bookmark, Clock, Diamond, AlertTriangle, Check, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const CreatorRulesContent = () => {
  return (
    <Card className="border-indigo-800/30 shadow-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
      <CardHeader className="bg-gradient-to-r from-indigo-950/50 to-slate-950/70 pb-6 border-b border-indigo-900/20">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-400" />
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">
            Règles des créateurs 🌟
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-indigo-300">
              <Clock className="h-5 w-5 text-indigo-400" />
              Obligations de streaming
            </h3>
            <div className="pl-7 space-y-3 text-slate-300">
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Chaque créateur doit effectuer 15 heures de live par semaine.</span>
              </p>
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Les streams doivent être répartis sur 7 jours de la semaine.</span>
              </p>
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Le planning de streaming doit être respecté et communiqué à l'avance à votre agent.</span>
              </p>
            </div>
          </section>
          
          <Separator className="bg-indigo-900/20" />
          
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-indigo-300">
              <Diamond className="h-5 w-5 text-indigo-400" />
              Objectifs de diamants
            </h3>
            <div className="pl-7 space-y-3 text-slate-300">
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Un minimum de diamants doit être collecté chaque semaine selon votre niveau.</span>
              </p>
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Les objectifs sont fixés en fonction de votre historique et de votre progression.</span>
              </p>
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Des bonus sont attribués lorsque les objectifs sont dépassés.</span>
              </p>
            </div>
          </section>
          
          <Separator className="bg-indigo-900/20" />
          
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-indigo-300">
              <DollarSign className="h-5 w-5 text-indigo-400" />
              Rémunération et paiements
            </h3>
            <div className="pl-7 space-y-3 text-slate-300">
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Les paiements sont effectués selon le calendrier défini dans votre contrat.</span>
              </p>
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>La valeur du diamant est fixée par l'agence et peut être ajustée périodiquement.</span>
              </p>
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Les bonus et commissions sont calculés à la fin de chaque mois.</span>
              </p>
            </div>
          </section>
          
          <Separator className="bg-indigo-900/20" />
          
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-indigo-300">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Pénalités
            </h3>
            <div className="pl-7 space-y-3 text-slate-300">
              <p className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <span>Le non-respect des heures ou jours de streaming peut entraîner des pénalités.</span>
              </p>
              <p className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <span>Des sanctions peuvent être appliquées en cas de comportement inapproprié.</span>
              </p>
              <p className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <span>Le manquement répété aux règles peut conduire à une résiliation de contrat.</span>
              </p>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};
