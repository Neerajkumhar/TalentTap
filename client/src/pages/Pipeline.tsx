import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import PipelineColumn from "@/components/PipelineColumn";
import CandidateCard from "@/components/CandidateCard";

const PIPELINE_STAGES = [
  { id: 'applied', title: 'Applied', color: 'bg-gray-50' },
  { id: 'screening', title: 'Screening', color: 'bg-blue-50' },
  { id: 'interview', title: 'Interview', color: 'bg-warning-50' },
  { id: 'decision', title: 'Decision', color: 'bg-success-50' },
  { id: 'hired', title: 'Hired', color: 'bg-green-100' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-50' },
];

export default function Pipeline() {
  const { toast } = useToast();

  const { data: pipelineData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/pipeline"],
    retry: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: number; status: string }) => {
      await apiRequest("PUT", `/api/applications/${applicationId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/pipeline"] });
      toast({
        title: "Success",
        description: "Candidate moved successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to move candidate",
        variant: "destructive",
      });
    },
  });

  const getApplicationsByStatus = (status: string) => {
    return pipelineData?.applications?.filter((app: any) => app.status === status) || [];
  };

  const getStatusCount = (status: string) => {
    return getApplicationsByStatus(status).length;
  };

  const handleDragStart = (e: React.DragEvent, applicationId: number) => {
    e.dataTransfer.setData("applicationId", applicationId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const applicationId = parseInt(e.dataTransfer.getData("applicationId"));
    if (applicationId) {
      updateStatusMutation.mutate({ applicationId, status: newStatus });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Recruitment Pipeline</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-96"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Recruitment Pipeline</h1>
          <p className="text-gray-600">Drag and drop candidates between stages</p>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {PIPELINE_STAGES.map((stage) => (
          <Card key={stage.id} className="material-elevation-1">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {getStatusCount(stage.id)}
                </div>
                <div className="text-sm text-gray-600">{stage.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-96">
        {PIPELINE_STAGES.map((stage) => (
          <div
            key={stage.id}
            className={`${stage.color} rounded-lg p-4 min-h-96`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">{stage.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {getStatusCount(stage.id)}
              </Badge>
            </div>
            
            <div className="space-y-3 custom-scrollbar max-h-80 overflow-y-auto">
              {getApplicationsByStatus(stage.id).map((application: any) => (
                <div
                  key={application.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, application.id)}
                  className="bg-white p-3 rounded-lg material-elevation-1 cursor-move hover:material-elevation-4 transition-shadow duration-200"
                >
                  <CandidateCard application={application} />
                </div>
              ))}
              
              {getStatusCount(stage.id) === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <span className="material-icons text-3xl mb-2 block">inbox</span>
                  <p className="text-sm">No candidates</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <Card className="material-elevation-1">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="material-icons text-primary">info</span>
            <span>Drag and drop candidate cards between columns to update their status in the recruitment pipeline.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
