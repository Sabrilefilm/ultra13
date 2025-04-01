
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bookmark, Clock, Shield, Check, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const InternalRulesContent = () => {
  return (
    <Card className="border-indigo-800/30 shadow-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
      <CardHeader className="bg-gradient-to-r from-indigo-950/50 to-slate-950/70 pb-6 border-b border-indigo-900/20">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-400" />
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-300 to-blue-300 bg-clip-text text-transparent">
            Règlement intérieur 📝
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-indigo-300">
              <Bookmark className="h-5 w-5 text-indigo-400" />
              Présence et participation
            </h3>
            <div className="pl-7 space-y-3 text-slate-300">
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Chaque agent doit rester en contact régulier avec ses créateurs.</span>
              </p>
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Les managers sont responsables du suivi des performances de leurs agents.</span>
              </p>
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>La participation aux réunions hebdomadaires est obligatoire pour tous les membres de l'équipe.</span>
              </p>
            </div>
          </section>
          
          <Separator className="bg-indigo-900/20" />
          
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-indigo-300">
              <Clock className="h-5 w-5 text-indigo-400" />
              Horaires et planification
            </h3>
            <div className="pl-7 space-y-3 text-slate-300">
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Les agents doivent suivre et mettre à jour les plannings de leurs créateurs.</span>
              </p>
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Les créateurs doivent respecter leur planning de 7 jours / 15 heures de stream par semaine.</span>
              </p>
              <p className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Toute modification d'horaire doit être communiquée au moins 24 heures à l'avance.</span>
              </p>
            </div>
          </section>
          
          <Separator className="bg-indigo-900/20" />
          
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-indigo-300">
              <Shield className="h-5 w-5 text-indigo-400" />
              Sanctions et pénalités
            </h3>
            <div className="pl-7 space-y-3 text-slate-300">
              <p className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <span>Le non-respect des règles peut entraîner des sanctions administratives.</span>
              </p>
              <p className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <span>Les pénalités peuvent inclure des réductions sur les commissions et les primes.</span>
              </p>
              <p className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                <span>Les infractions répétées peuvent conduire à une résiliation du contrat.</span>
              </p>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};
