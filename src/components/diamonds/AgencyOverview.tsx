
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Diamond } from 'lucide-react';
import { DiamondGoalForm } from './DiamondGoalForm';
import { DiamondProgress } from './DiamondProgress';

interface AgencyOverviewProps {
  totalAgencyDiamonds: number;
  agencyGoal: number;
  diamondValue: number;
  role: string;
  setAgencyGoal: (value: number) => void;
  handleUpdateAgencyGoal: () => Promise<void>;
  isEditing: boolean;
}

export function AgencyOverview({
  totalAgencyDiamonds,
  agencyGoal,
  diamondValue,
  role,
  setAgencyGoal,
  handleUpdateAgencyGoal,
  isEditing
}: AgencyOverviewProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-purple-200 dark:border-purple-900/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Diamond className="h-5 w-5 text-purple-400" />
          Objectif Diamants Agence
        </CardTitle>
        <CardDescription>
          Progression de l'agence vers l'objectif de diamants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Diamants</p>
            <p className="text-2xl font-bold">{totalAgencyDiamonds.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Valeur: {(totalAgencyDiamonds * diamondValue).toLocaleString()}€
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Objectif</p>
            {role === 'founder' || role === 'manager' ? (
              <DiamondGoalForm
                value={agencyGoal}
                onChange={setAgencyGoal}
                onSave={handleUpdateAgencyGoal}
                isEditing={isEditing}
              />
            ) : (
              <p className="text-2xl font-bold">{agencyGoal.toLocaleString()}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Progression</p>
            <p className="text-2xl font-bold">
              {agencyGoal > 0 ? Math.min(Math.round((totalAgencyDiamonds / agencyGoal) * 100), 100) : 0}%
            </p>
          </div>
        </div>
        
        <DiamondProgress total={totalAgencyDiamonds} goal={agencyGoal} />
      </CardContent>
    </Card>
  );
}
