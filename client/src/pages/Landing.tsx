import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="material-icons text-white text-sm">work</span>
              </div>
              <h1 className="text-xl font-medium text-gray-900">TalentTap</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-primary hover:bg-primary-600"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Modern Recruitment
            <span className="text-primary"> Made Simple</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your hiring process with TalentTap's comprehensive applicant tracking system. 
            Manage candidates, track applications, and collaborate with your team all in one place.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button 
              onClick={() => window.location.href = '/login'}
              className="w-full sm:w-auto bg-primary hover:bg-primary-600 text-lg px-8 py-3"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="material-elevation-1 hover-elevation transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-icons text-primary">dashboard</span>
                </div>
                <CardTitle>Smart Dashboard</CardTitle>
                <CardDescription>
                  Get real-time insights into your recruitment process with comprehensive analytics and KPIs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="material-elevation-1 hover-elevation transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-icons text-secondary-500">view_kanban</span>
                </div>
                <CardTitle>Kanban Pipeline</CardTitle>
                <CardDescription>
                  Visualize your recruitment pipeline and easily move candidates through different stages.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="material-elevation-1 hover-elevation transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-warning-50 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-icons text-warning-500">group</span>
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Work together with your hiring team, share feedback, and make collaborative decisions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="material-elevation-1 hover-elevation transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-icons text-success-500">calendar_today</span>
                </div>
                <CardTitle>Interview Scheduling</CardTitle>
                <CardDescription>
                  Schedule interviews seamlessly with integrated calendar management and notifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="material-elevation-1 hover-elevation transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-icons text-error-500">analytics</span>
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Track your recruitment metrics and optimize your hiring process with detailed reports.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="material-elevation-1 hover-elevation transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-icons text-primary">work</span>
                </div>
                <CardTitle>Job Management</CardTitle>
                <CardDescription>
                  Create and manage job postings with rich descriptions and automated distribution.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
