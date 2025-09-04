import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, Building, Shield, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const { user, profile, signOut } = useAuth();

  // Navigation items for non-authenticated users
  const publicNavigationItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/user-login",
      label: "User Login",
      icon: User,
    },
    {
      path: "/pg-owner-login",
      label: "PG Owner Login",
      icon: Building,
    },
    {
      path: "/admin-login",
      label: "Admin Login",
      icon: Shield,
    },
  ];

  // Navigation items for authenticated users
  const authenticatedNavigationItems = [
    {
      path: "/",
      label: "Home",
      icon: Home,
    },
    {
      path: "/pg-listings", 
      label: "Browse PGs",
      icon: Building,
    },
  ];

  const navigationItems = user ? authenticatedNavigationItems : publicNavigationItems;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-deep-charcoal to-accent/90 backdrop-blur-sm border-b border-gold-accent/30 shadow-elegant">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-accent to-accent rounded-lg flex items-center justify-center shadow-gold">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gold-accent to-cream bg-clip-text text-transparent">
              PG Pathfinder
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path} onClick={() => setActiveTab(item.path)}>
                  <Button
                    variant={isActive ? "glass" : "ghost"}
                    className={`flex items-center gap-2 text-white/90 hover:text-white transition-colors ${
                      isActive ? "bg-white/20 shadow-gold" : "hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            
            {/* User info and signout when authenticated */}
            {user && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/30">
                <span className="text-sm text-white/80">
                  {profile?.full_name || user.email}
                </span>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border-white/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" className="md:hidden text-white/90 hover:text-white hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;