
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/loading';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { TransferRequestDialog } from '@/components/transfers/TransferRequestDialog';

const Transfers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [transferRequests, setTransferRequests] = useState([]);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('pending');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session?.user) {
          navigate('/');
          return;
        }
        
        setUserId(data.session.user.id);
        
        // Get user role and username
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('role, username')
          .eq('id', data.session.user.id)
          .single();
          
        if (error) throw error;
        
        setRole(userData?.role || 'creator');
        setUsername(userData?.username || data.session.user.email || 'User');
        
        // Load transfer requests
        await fetchTransferRequests();
      } catch (error) {
        console.error('Error checking session:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de session",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  const fetchTransferRequests = async () => {
    try {
      let query;
      
      if (role === 'founder') {
        // Founder sees all requests
        query = supabase
          .from('transfer_requests')
          .select(`
            *,
            creator:creator_id(id, username),
            current_agent:current_agent_id(id, username),
            requested_agent:requested_agent_id(id, username)
          `)
          .order('created_at', { ascending: false });
      } else if (role === 'manager') {
        // Manager sees requests involving his agents
        query = supabase
          .from('transfer_requests')
          .select(`
            *,
            creator:creator_id(id, username),
            current_agent:current_agent_id(id, username),
            requested_agent:requested_agent_id(id, username)
          `)
          .or(`current_agent_id.eq.${userId},requested_agent_id.eq.${userId}`)
          .order('created_at', { ascending: false });
      } else if (role === 'agent') {
        // Agent sees requests involving him
        query = supabase
          .from('transfer_requests')
          .select(`
            *,
            creator:creator_id(id, username),
            current_agent:current_agent_id(id, username),
            requested_agent:requested_agent_id(id, username)
          `)
          .or(`current_agent_id.eq.${userId},requested_agent_id.eq.${userId}`)
          .order('created_at', { ascending: false });
      } else {
        // Creator sees his own requests
        query = supabase
          .from('transfer_requests')
          .select(`
            *,
            creator:creator_id(id, username),
            current_agent:current_agent_id(id, username),
            requested_agent:requested_agent_id(id, username)
          `)
          .eq('creator_id', userId)
          .order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTransferRequests(data || []);
    } catch (error) {
      console.error('Error fetching transfer requests:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des demandes de transfert",
      });
    }
  };

  const handleApproveTransfer = async (requestId) => {
    try {
      // Update transfer request status
      const { error: updateError } = await supabase
        .from('transfer_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);
        
      if (updateError) throw updateError;
      
      // Get the transfer request details
      const { data: requestData, error: fetchError } = await supabase
        .from('transfer_requests')
        .select('*')
        .eq('id', requestId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Update the creator's agent in user_accounts
      const { error: updateAgentError } = await supabase
        .from('user_accounts')
        .update({ agent_id: requestData.requested_agent_id })
        .eq('id', requestData.creator_id);
        
      if (updateAgentError) throw updateAgentError;
      
      toast({
        title: "Succès",
        description: "Transfert approuvé avec succès",
      });
      
      fetchTransferRequests();
    } catch (error) {
      console.error('Error approving transfer:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation du transfert",
      });
    }
  };

  const handleRejectTransfer = async (requestId, rejectionReason) => {
    try {
      const { error } = await supabase
        .from('transfer_requests')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason || 'Demande rejetée'
        })
        .eq('id', requestId);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Transfert rejeté avec succès",
      });
      
      fetchTransferRequests();
    } catch (error) {
      console.error('Error rejecting transfer:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet du transfert",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredRequests = transferRequests.filter(request => {
    if (selectedTab === 'all') return true;
    return request.status === selectedTab;
  });

  if (loading) {
    return <Loading fullScreen size="large" text="Chargement des transferts..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar 
        username={username}
        role={role}
        onLogout={handleLogout}
        currentPage="transfers"
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Gestion des Transferts</h1>
          </div>
          
          {(role === 'creator' || role === 'agent') && (
            <Button
              onClick={() => setShowTransferDialog(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Demande de transfert
            </Button>
          )}
        </div>
        
        <div className="flex-1 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Demandes de transfert</CardTitle>
              <Tabs defaultValue="pending" value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList>
                  <TabsTrigger value="pending">En attente</TabsTrigger>
                  <TabsTrigger value="approved">Approuvées</TabsTrigger>
                  <TabsTrigger value="rejected">Rejetées</TabsTrigger>
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {filteredRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Créateur</TableHead>
                      <TableHead>Agent actuel</TableHead>
                      <TableHead>Agent demandé</TableHead>
                      <TableHead>Raison</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      {(role === 'founder' || role === 'manager') && selectedTab === 'pending' && (
                        <TableHead>Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.creator?.username || 'Inconnu'}</TableCell>
                        <TableCell>{request.current_agent?.username || 'Aucun'}</TableCell>
                        <TableCell>{request.requested_agent?.username || 'Inconnu'}</TableCell>
                        <TableCell className="max-w-xs truncate">{request.reason || 'Non spécifiée'}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {request.status === 'pending' && (
                              <Clock className="h-4 w-4 text-amber-500 mr-1" />
                            )}
                            {request.status === 'approved' && (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            )}
                            {request.status === 'rejected' && (
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className="capitalize">
                              {request.status === 'pending' ? 'En attente' : 
                               request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                            </span>
                          </div>
                          {request.status === 'rejected' && request.rejection_reason && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Raison: {request.rejection_reason}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(request.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </TableCell>
                        {(role === 'founder' || role === 'manager') && request.status === 'pending' && (
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                                onClick={() => handleApproveTransfer(request.id)}
                              >
                                Approuver
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => handleRejectTransfer(request.id)}
                              >
                                Rejeter
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Aucune demande de transfert</p>
                  {role === 'creator' && (
                    <Button
                      onClick={() => setShowTransferDialog(true)}
                      variant="outline"
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Faire une demande
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <TransferRequestDialog
        isOpen={showTransferDialog}
        onClose={() => setShowTransferDialog(false)}
        userId={userId}
        role={role}
        onSuccess={fetchTransferRequests}
      />
    </div>
  );
};

export default Transfers;
