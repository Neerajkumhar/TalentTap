import { Badge } from "@/components/ui/badge";
import CandidateCard from "./CandidateCard";

interface PipelineColumnProps {
  title: string;
  status: string;
  applications: any[];
  color: string;
  onDrop: (status: string) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export default function PipelineColumn({
  title,
  status,
  applications,
  color,
  onDrop,
  onDragOver,
}: PipelineColumnProps) {
  return (
    <div
      className={`${color} rounded-lg p-4 min-h-96`}
      onDragOver={onDragOver}
      onDrop={() => onDrop(status)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          {applications.length}
        </Badge>
      </div>
      
      <div className="space-y-3 custom-scrollbar max-h-80 overflow-y-auto">
        {applications.map((application) => (
          <div
            key={application.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("applicationId", application.id.toString());
            }}
            className="bg-white p-3 rounded-lg material-elevation-1 cursor-move hover:material-elevation-4 transition-shadow duration-200"
          >
            <CandidateCard application={application} />
          </div>
        ))}
        
        {applications.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <span className="material-icons text-3xl mb-2 block">inbox</span>
            <p className="text-sm">No candidates</p>
          </div>
        )}
      </div>
    </div>
  );
}
