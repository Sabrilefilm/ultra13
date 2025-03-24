
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DiamondGoalFormProps {
  value: number;
  onChange: (value: number) => void;
  onSave: () => Promise<void>;
  isEditing: boolean;
}

export function DiamondGoalForm({ value, onChange, onSave, isEditing }: DiamondGoalFormProps) {
  return (
    <div className="flex items-center gap-2">
      <Input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-32"
      />
      <Button 
        size="sm" 
        onClick={onSave}
        disabled={isEditing}
      >
        Enregistrer
      </Button>
    </div>
  );
}
