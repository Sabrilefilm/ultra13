
import React from 'react';
import { Loading } from '@/components/ui/loading';

export const TransferDialogLoading: React.FC = () => {
  return (
    <div className="py-6">
      <Loading text="Chargement..." />
    </div>
  );
};
