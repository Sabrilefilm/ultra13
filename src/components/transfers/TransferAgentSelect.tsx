
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Agent } from './hooks/useTransferRequestForm';

interface TransferAgentSelectProps {
  agents: Agent[];
  selectedAgent: string;
  onSelectAgent: (value: string) => void;
}

export const TransferAgentSelect: React.FC<TransferAgentSelectProps> = ({
  agents,
  selectedAgent,
  onSelectAgent
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="agent">Agent demandé</Label>
      <Select 
        value={selectedAgent} 
        onValueChange={onSelectAgent}
      >
        <SelectTrigger id="agent">
          <SelectValue placeholder="Sélectionnez un agent" />
        </SelectTrigger>
        <SelectContent>
          {agents.map((agent) => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
