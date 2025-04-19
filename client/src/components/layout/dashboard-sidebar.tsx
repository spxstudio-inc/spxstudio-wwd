import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  FolderOpen, 
  Code2, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  minimal?: boolean;
}

export default function DashboardSidebar({ minimal = false }: DashboardSidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [collapsed, setCollapsed] = useState(minimal);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/create", label: "Create", icon: <PlusCircle className="h-5 w-5" /> },
    { href: "/editor", label: "Code Editor", icon: <Code2 className="h-5 w-5" /> },
    { href: "/storage", label: "Storage", icon: <FolderOpen className="h-5 w-5" /> },
    { href: "/websites", label: "My Websites", icon: <FileText className="h-5 w-5" /> },
  ];
  
  const secondaryNavItems = [
    { href: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { href: "/help", label: "Help", icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const sidebarWidth = collapsed ? "w-[60px]" : "w-[240px]";

  return (
    <div className={cn("h-screen bg-gray-900 text-white flex flex-col", sidebarWidth, "transition-all")}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <Link href="/dashboard" className="text-xl font-bold text-white">
            SPX STUDIO
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      location === item.href ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                    )}
                  >
                    {item.icon}
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-8">
            <div className="px-3 mb-2">
              {!collapsed && <p className="text-xs uppercase text-gray-500">Support</p>}
            </div>
            <ul className="space-y-1">
              {secondaryNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        location === item.href ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                      )}
                    >
                      {item.icon}
                      {!collapsed && <span className="ml-3">{item.label}</span>}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-white">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-2">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800",
            collapsed ? "px-2" : ""
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
