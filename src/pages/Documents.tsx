import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/loading';
import { DocumentUploadDialog } from '@/components/documents/DocumentUploadDialog';
import { Badge } from '@/components/ui/badge';

interface Document {
  id: string;
  user_id: string;
  document_front: string;
  document_back: string;
  uploaded_at: string;
  verified: boolean;
  username: string;
}

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [userDocument, setUserDocument] = useState<Document | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session?.user) {
          navigate('/');
          return;
        }
        
        setUserId(data.session.user.id);
        
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('role, username')
          .eq('id', data.session.user.id)
          .single();
          
        if (error) throw error;
        
        setRole(userData?.role || 'creator');
        setUsername(userData?.username || data.session.user.email || 'User');
        
        if (role === 'founder' || role === 'manager') {
          await fetchAllDocuments();
        } else {
          await fetchUserDocument(data.session.user.id);
        }
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
  }, [navigate, role]);

  const fetchAllDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('identity_documents')
        .select(`
          *,
          user:user_id(username)
        `)
        .order('uploaded_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedDocs = data.map(doc => ({
        ...doc,
        username: doc.user?.username || 'Utilisateur inconnu'
      }));
      
      setDocuments(formattedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les documents",
      });
    }
  };

  const fetchUserDocument = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('identity_documents')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setUserDocument(data as Document);
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre document",
      });
    }
  };

  const handleVerifyDocument = async (docId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('identity_documents')
        .update({ verified })
        .eq('id', docId);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: verified 
          ? "Document vérifié avec succès" 
          : "Document marqué comme non vérifié",
      });
      
      if (role === 'founder' || role === 'manager') {
        await fetchAllDocuments();
      } else {
        await fetchUserDocument(userId);
      }
    } catch (error) {
      console.error('Error verifying document:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du document",
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

  const filteredDocuments = documents.filter(doc => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'verified') return doc.verified;
    if (selectedTab === 'unverified') return !doc.verified;
    return true;
  });

  if (loading) {
    return <Loading fullScreen size="large" text="Chargement des documents..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar 
        username={username}
        role={role}
        onLogout={handleLogout}
        currentPage="documents"
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
            <h1 className="text-xl font-bold">Gestion des Documents</h1>
          </div>
          
          {role === 'creator' && (
            <Button
              onClick={() => setShowUploadDialog(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Télécharger document
            </Button>
          )}
        </div>
        
        <div className="flex-1 p-4">
          {(role === 'founder' || role === 'manager') ? (
            <Card>
              <CardHeader>
                <CardTitle>Documents d'identité</CardTitle>
                <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList>
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="verified">Vérifiés</TabsTrigger>
                    <TabsTrigger value="unverified">Non vérifiés</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {filteredDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{doc.username}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <Badge variant={doc.verified ? "secondary" : "destructive"} className={doc.verified ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}>
                            {doc.verified ? 'Vérifié' : 'Non vérifié'}
                          </Badge>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recto</p>
                            {doc.document_front ? (
                              <a 
                                href={doc.document_front} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block h-32 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden"
                              >
                                <img 
                                  src={doc.document_front} 
                                  alt="Recto" 
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ) : (
                              <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-md">
                                <FileText className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Verso</p>
                            {doc.document_back ? (
                              <a 
                                href={doc.document_back} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block h-32 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden"
                              >
                                <img 
                                  src={doc.document_back} 
                                  alt="Verso" 
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ) : (
                              <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-md">
                                <FileText className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-4 pt-0 flex space-x-2">
                          {doc.verified ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleVerifyDocument(doc.id, false)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Marquer non vérifié
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                              onClick={() => handleVerifyDocument(doc.id, true)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Vérifier
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Aucun document trouvé</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Mon document d'identité</CardTitle>
              </CardHeader>
              <CardContent>
                {userDocument ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Document téléchargé le {new Date(userDocument.uploaded_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Badge 
                        variant={userDocument.verified ? "secondary" : "outline"} 
                        className={userDocument.verified ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"}
                      >
                        {userDocument.verified ? 'Vérifié' : 'En attente de vérification'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Recto</h3>
                        {userDocument.document_front ? (
                          <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                            <img 
                              src={userDocument.document_front} 
                              alt="Recto" 
                              className="w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-md">
                            <FileText className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Verso</h3>
                        {userDocument.document_back ? (
                          <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
                            <img 
                              src={userDocument.document_back} 
                              alt="Verso" 
                              className="w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-md">
                            <FileText className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center mt-4">
                      <Button 
                        onClick={() => setShowUploadDialog(true)}
                        variant="outline"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Mettre à jour le document
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
                      <AlertTriangle className="h-10 w-10 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Aucun document téléchargé</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md">
                      Vous devez télécharger une pièce d'identité valide (carte d'identité ou passeport).
                    </p>
                    <Button 
                      onClick={() => setShowUploadDialog(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Télécharger mon document
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <DocumentUploadDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        userId={userId}
        existingDocument={userDocument || undefined}
        onSuccess={() => fetchUserDocument(userId)}
      />
    </div>
  );
};

export default Documents;
