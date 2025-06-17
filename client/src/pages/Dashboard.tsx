import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import MetricsCard from "@/components/MetricsCard";
import ApplicationCard from "@/components/ApplicationCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    retry: false,
  });

  const { data: recentApplications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/dashboard/recent-applications"],
    retry: false,
  });

  const { data: pipelineData, isLoading: pipelineLoading } = useQuery({
    queryKey: ["/api/dashboard/pipeline"],
    retry: false,
  });

  const { data: todayInterviews, isLoading: interviewsLoading } = useQuery({
    queryKey: ["/api/interviews/today"],
    retry: false,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/dashboard/activities"],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getUserName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    return "there";
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-2">
          {getGreeting()}, {getUserName()}! 👋
        </h2>
        <p className="text-gray-600">Here's what's happening with your recruiting today.</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Applications"
          value={metrics?.totalApplications || 0}
          change="+12% from last month"
          changeType="positive"
          icon="person_add"
          color="primary"
          loading={metricsLoading}
        />
        <MetricsCard
          title="Active Jobs"
          value={metrics?.activeJobs || 0}
          change="+3 new this week"
          changeType="positive"
          icon="work"
          color="secondary"
          loading={metricsLoading}
        />
        <MetricsCard
          title="Interviews Scheduled"
          value={metrics?.scheduledInterviews || 0}
          change={`${todayInterviews?.length || 0} today`}
          changeType="neutral"
          icon="calendar_today"
          color="warning"
          loading={metricsLoading}
        />
        <MetricsCard
          title="Time to Hire"
          value={`${metrics?.timeToHire || 0} days`}
          change="-2 days avg"
          changeType="positive"
          icon="timer"
          color="success"
          loading={metricsLoading}
        />
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Applications */}
        <Card className="lg:col-span-2 material-elevation-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Applications</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-600">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications?.slice(0, 3).map((application: any) => (
                  <ApplicationCard key={application.id} application={application} />
                )) || (
                  <p className="text-gray-500 text-center py-8">No recent applications</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="material-elevation-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full flex items-center space-x-3 p-4 h-auto border-primary/20 hover:bg-primary/5">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-icons text-primary text-xl">add</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Post New Job</p>
                  <p className="text-sm text-gray-600">Create a new job posting</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full flex items-center space-x-3 p-4 h-auto border-secondary/20 hover:bg-secondary/5">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <span className="material-icons text-secondary-500 text-xl">person_add</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Add Candidate</p>
                  <p className="text-sm text-gray-600">Manually add candidate</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full flex items-center space-x-3 p-4 h-auto border-warning/20 hover:bg-warning/5">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <span className="material-icons text-warning-500 text-xl">schedule</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Schedule Interview</p>
                  <p className="text-sm text-gray-600">Book interview slot</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full flex items-center space-x-3 p-4 h-auto border-success/20 hover:bg-success/5">
                <div className="p-2 bg-success/10 rounded-lg">
                  <span className="material-icons text-success-500 text-xl">analytics</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Reports</p>
                  <p className="text-sm text-gray-600">Recruitment analytics</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Overview */}
      <Card className="material-elevation-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recruitment Pipeline</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-600">
              View Full Pipeline
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pipelineLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-48"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Applied Stage */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Applied</h4>
                  <Badge variant="secondary">
                    {pipelineData?.applications?.filter((app: any) => app.status === 'applied').length || 0}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {pipelineData?.applications?.filter((app: any) => app.status === 'applied').slice(0, 2).map((app: any) => (
                    <div key={app.id} className="bg-white p-3 rounded-lg material-elevation-1 cursor-pointer hover:material-elevation-4 transition-shadow duration-200">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {app.candidateName?.split(' ').map((n: string) => n[0]).join('') || 'N/A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{app.candidateName}</p>
                          <p className="text-sm text-gray-600 truncate">{app.jobTitle}</p>
                          {app.score && (
                            <div className="flex items-center mt-2">
                              <span className="material-icons text-success-500 mr-1 text-sm">star</span>
                              <span className="text-xs text-gray-500">{app.score}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-sm">No applications</p>}
                </div>
              </div>

              {/* Interview Stage */}
              <div className="bg-warning-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Interview</h4>
                  <Badge className="bg-warning-200 text-warning-800">
                    {pipelineData?.applications?.filter((app: any) => app.status === 'interview').length || 0}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {pipelineData?.applications?.filter((app: any) => app.status === 'interview').slice(0, 2).map((app: any) => (
                    <div key={app.id} className="bg-white p-3 rounded-lg material-elevation-1 cursor-pointer hover:material-elevation-4 transition-shadow duration-200">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {app.candidateName?.split(' ').map((n: string) => n[0]).join('') || 'N/A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{app.candidateName}</p>
                          <p className="text-sm text-gray-600 truncate">{app.jobTitle}</p>
                        </div>
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-sm">No interviews</p>}
                </div>
              </div>

              {/* Decision Stage */}
              <div className="bg-success-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Decision</h4>
                  <Badge className="bg-success-200 text-success-800">
                    {pipelineData?.applications?.filter((app: any) => app.status === 'decision').length || 0}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {pipelineData?.applications?.filter((app: any) => app.status === 'decision').slice(0, 2).map((app: any) => (
                    <div key={app.id} className="bg-white p-3 rounded-lg material-elevation-1 cursor-pointer hover:material-elevation-4 transition-shadow duration-200">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {app.candidateName?.split(' ').map((n: string) => n[0]).join('') || 'N/A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{app.candidateName}</p>
                          <p className="text-sm text-gray-600 truncate">{app.jobTitle}</p>
                          <div className="flex items-center mt-1">
                            <span className="material-icons text-success-500 mr-1 text-sm">check_circle</span>
                            <p className="text-xs text-success-600">Final Review</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || <p className="text-gray-500 text-sm">No decisions</p>}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Interviews */}
        <Card className="material-elevation-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Interviews</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-600">
                View Calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {interviewsLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {todayInterviews?.length ? todayInterviews.map((interview: any) => (
                  <div key={interview.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary text-sm font-medium">
                          {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{interview.candidateName}</h4>
                      <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                      <p className="text-xs text-gray-500">with {interview.interviewerName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <span className="material-icons text-lg">videocam</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <span className="material-icons text-lg">edit</span>
                      </Button>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-8">No interviews scheduled for today</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Activity */}
        <Card className="material-elevation-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary-600">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities?.length ? activities.map((activity: any) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={activity.userProfileImage} />
                      <AvatarFallback className="text-xs">
                        {activity.userName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.userName}</span> {activity.action.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
