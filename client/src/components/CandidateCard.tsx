import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CandidateCardProps {
  application: {
    id: number;
    candidateName: string;
    jobTitle: string;
    score?: number;
    status?: string;
  };
}

export default function CandidateCard({ application }: CandidateCardProps) {
  return (
    <div className="flex items-start space-x-3">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="text-xs">
          {application.candidateName?.split(' ').map(n => n[0]).join('') || 'N/A'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{application.candidateName}</p>
        <p className="text-sm text-gray-600 truncate">{application.jobTitle}</p>
        {application.score && (
          <div className="flex items-center mt-2">
            <span className="material-icons text-success-500 mr-1" style={{ fontSize: '14px' }}>star</span>
            <span className="text-xs text-gray-500">{application.score}%</span>
          </div>
        )}
        {application.status === 'decision' && (
          <div className="flex items-center mt-1">
            <span className="material-icons text-success-500 mr-1" style={{ fontSize: '14px' }}>check_circle</span>
            <p className="text-xs text-success-600">Final Review</p>
          </div>
        )}
      </div>
    </div>
  );
}
