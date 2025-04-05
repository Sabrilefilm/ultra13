import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { diamondsService } from '@/services/diamonds/diamonds-service';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

interface QuickDiamondsMenuProps {
  creatorId: string;
  onSuccess: () => Promise<void>;
}

export function QuickDiamondsMenu({ creatorId, onSuccess }: QuickDiamondsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'subtract'>('add');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Utiliser la fonction updateDiamonds avec la bonne signature
      const success = await diamondsService.updateDiamonds(
        creatorId, 
        amount, 
        activeTab // 'add' ou 'subtract'
      );
      
      if (success) {
        const actionText = activeTab === 'add' ? 'ajoutés' : 'retirés';
        toast.success(`${amount} diamants ${actionText} avec succès`);
        setAmount(0);
        setIsOpen(false);
        await onSuccess();
      } else {
        toast.error("Échec de la mise à jour des diamants");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des diamants:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1 bg-white text-purple-600 border-purple-200 hover:bg-purple-50 dark:bg-slate-800 dark:border-purple-800/40 dark:text-purple-400 dark:hover:bg-purple-900/30"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Diamants</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 pb-0">
          <h4 className="font-medium text-sm">Gestion rapide des diamants</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Ajoutez ou retirez des diamants pour ce créateur
          </p>
        </div>
        
        <Tabs 
          defaultValue="add" 
          className="w-full mt-2" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'add' | 'subtract')}
        >
          <div className="px-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="add">Ajouter</TabsTrigger>
              <TabsTrigger value="subtract">Retirer</TabsTrigger>
            </TabsList>
          </div>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="add" className="p-4 pt-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-amount">Montant à ajouter</Label>
                <Input
                  id="add-amount"
                  type="number"
                  min="1"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  placeholder="Nombre de diamants"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || amount <= 0}
              >
                {isSubmitting ? "En cours..." : "Ajouter les diamants"}
              </Button>
            </TabsContent>
            
            <TabsContent value="subtract" className="p-4 pt-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subtract-amount">Montant à retirer</Label>
                <Input
                  id="subtract-amount"
                  type="number"
                  min="1"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  placeholder="Nombre de diamants"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || amount <= 0}
              >
                {isSubmitting ? "En cours..." : "Retirer les diamants"}
              </Button>
            </TabsContent>
          </form>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
