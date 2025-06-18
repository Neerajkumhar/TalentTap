import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.email || "User";
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user?.firstName) {
      return user.firstName[0];
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white material-elevation-4 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <span className="material-icons text-white text-sm">work</span>
                </div>
                <h1 className="text-xl font-medium text-gray-900">TalentTap</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
                <span className="material-icons text-gray-500 mr-2">search</span>
                <Input 
                  type="text" 
                  placeholder="Search candidates, jobs..." 
                  className="bg-transparent border-none outline-none flex-1 text-sm p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0" 
                />
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <span className="material-icons text-gray-600">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profileImageUrl} />
                      <AvatarFallback className="text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {getUserName()}
                    </span>
                    <span className="material-icons text-gray-500">keyboard_arrow_down</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                    <span className="material-icons mr-2 text-sm">person</span>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="material-icons mr-2 text-sm">settings</span>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="material-icons mr-2 text-sm">help</span>
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}>
                    <span className="material-icons mr-2 text-sm">logout</span>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full material-elevation-8 hover:bg-primary-600 transition-colors duration-200 p-0">
        <span className="material-icons">add</span>
      </Button>
    </div>
  );
}
