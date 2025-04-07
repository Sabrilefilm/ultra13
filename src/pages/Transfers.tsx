
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/loading';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TransferRequestDialog } from '@/components/transfers/TransferRequestDialog';
import { TransferHeader } from '@/components/transfers/TransferHeader';
import { TransferTabs } from '@/components/transfers/TransferTabs';
import { TransferTable } from '@/components/transfers/TransferTable';
import { TransferEmptyState } from '@/components/transfers/TransferEmptyState';
import { useTransferRequests } from '@/components/transfers/hooks/useTransferRequests';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

const Transfers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('pending');
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Vérifier l'authentification via localStorage
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');
        
        if (!isAuthenticated || !storedUsername || !storedRole) {
          toast({
            variant: "destructive",
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
          });
          navigate('/');
          return;
        }
        
        setUserId(storedUserId || '');
        setRole(storedRole);
        setUsername(storedUsername);
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de session",
        });
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate, toast]);

  const { 
    loading: transfersLoading, 
    transferRequests, 
    handleApproveTransfer, 
    handleRejectTransfer,
    fetchTransferRequests
  } = useTransferRequests(userId, role);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredRequests = transferRequests.filter(request => {
    if (selectedTab === 'all') return true;
    return request.status === selectedTab;
  });

  if (loading || transfersLoading) {
    return <Loading fullScreen size="large" text="Chargement des transferts..." />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white flex">
        <UltraSidebar 
          username={username}
          role={role}
          userId={userId}
          onLogout={handleLogout}
          currentPage="transfers"
        >
          <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <BackButton className="mr-2" />
                <TransferHeader 
                  role={role} 
                  onOpenTransferDialog={() => setShowTransferDialog(true)} 
                />
              </div>

              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-slate-800/80 border-slate-700/50 hover:bg-slate-700 text-white"
              >
                <HomeIcon className="h-4 w-4" />
                Retour à l'accueil
              </Button>
            </div>
            
            <Card className="shadow-md border-purple-900/30 bg-slate-800/90 backdrop-blur-sm">
              <TransferTabs 
                selectedTab={selectedTab} 
                onTabChange={setSelectedTab} 
              />
              
              <CardContent className="p-2 md:p-4">
                {filteredRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <TransferTable 
                      requests={filteredRequests}
                      role={role}
                      selectedTab={selectedTab}
                      onApprove={handleApproveTransfer}
                      onReject={handleRejectTransfer}
                    />
                  </div>
                ) : (
                  <TransferEmptyState 
                    role={role} 
                    onOpenTransferDialog={() => setShowTransferDialog(true)} 
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </UltraSidebar>

        <TransferRequestDialog
          isOpen={showTransferDialog}
          onClose={() => setShowTransferDialog(false)}
          userId={userId}
          role={role}
          onSuccess={() => fetchTransferRequests()}
        />
      </div>
    </SidebarProvider>
  );
};

export default Transfers;
