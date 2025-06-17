import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ApplicationCardProps {
  application: {
    id: number;
    candidateName: string;
    jobTitle: string;
    status: string;
    appliedAt: string;
    score?: number;
  };
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-primary-50 text-primary-700';
      case 'screening':
        return 'bg-blue-50 text-blue-700';
      case 'interview':
        return 'bg-warning-50 text-warning-700';
      case 'decision':
        return 'bg-success-50 text-success-700';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
      <Avatar className="w-12 h-12">
        <AvatarFallback>
          {application.candidateName?.split(' ').map(n => n[0]).join('') || 'N/A'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{application.candidateName}</h4>
        <p className="text-sm text-gray-600">{application.jobTitle}</p>
        <p className="text-xs text-gray-500">{formatTimeAgo(application.appliedAt)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Badge className={`text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
          {application.status}
        </Badge>
        {application.score && (
          <span className="flex items-center text-xs text-gray-500">
            <span className="material-icons text-success-500 mr-1" style={{ fontSize: '16px' }}>star</span>
            <span>{application.score}%</span>
          </span>
        )}
      </div>
    </div>
  );
}
