import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: "dashboard",
    },
    {
      path: "/jobs",
      label: "Jobs",
      icon: "work",
    },
    {
      path: "/candidates",
      label: "Candidates",
      icon: "people",
    },
    {
      path: "/pipeline",
      label: "Pipeline",
      icon: "view_kanban",
    },
    {
      path: "/interviews",
      label: "Interviews",
      icon: "calendar_today",
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: "analytics",
    },
    {
      path: "/team",
      label: "Team",
      icon: "group",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white material-elevation-1 transform transition-transform duration-300 ease-in-out pt-16 lg:translate-x-0">
        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200",
                    isActive(item.path) && "bg-primary-50 text-primary-600 font-medium hover:bg-primary-50"
                  )}
                >
                  <span className="material-icons">{item.icon}</span>
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link href="/settings">
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="material-icons">settings</span>
                <span>Settings</span>
              </Button>
            </Link>
            <Link href="/help">
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="material-icons">help</span>
                <span>Help & Support</span>
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
