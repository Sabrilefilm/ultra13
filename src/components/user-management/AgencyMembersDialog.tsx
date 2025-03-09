
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAgencyMembers } from "@/hooks/user-management/use-agency-members";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgencyMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
}

export const AgencyMembersDialog: React.FC<AgencyMembersDialogProps> = ({
  isOpen,
  onClose,
  agentId,
  agentName,
}) => {
  const {
    assignedCreators,
    unassignedCreators,
    assignCreatorToAgent,
    removeCreatorFromAgent,
    isLoading,
  } = useAgencyMembers(agentId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Membres de l'agence de {agentName}</DialogTitle>
          <DialogDescription>
            Gérer les créateurs assignés à cet agent
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="assigned" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assigned">
              Créateurs assignés ({assignedCreators.length})
            </TabsTrigger>
            <TabsTrigger value="unassigned">
              Créateurs disponibles ({unassignedCreators.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assigned">
            <Card>
              <CardHeader>
                <CardTitle>Créateurs assignés à cet agent</CardTitle>
              </CardHeader>
              <CardContent>
                {assignedCreators.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucun créateur assigné à cet agent
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom d'utilisateur</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedCreators.map((creator) => (
                        <TableRow key={creator.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <UserRound className="h-4 w-4" />
                              {creator.username}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeCreatorFromAgent(creator.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Retirer
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unassigned">
            <Card>
              <CardHeader>
                <CardTitle>Créateurs disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                {unassignedCreators.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucun créateur disponible
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom d'utilisateur</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unassignedCreators.map((creator) => (
                        <TableRow key={creator.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <UserRound className="h-4 w-4" />
                              {creator.username}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => assignCreatorToAgent(creator.id, agentId)}
                              disabled={isLoading}
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Assigner
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
