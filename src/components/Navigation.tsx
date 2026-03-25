import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, BarChart3, Trophy, Crown, Info, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import cemitrackLogo from "@/assets/cemitrack-logo.png";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
      navigate("/");
    }
  };

  const navItems = [
    { name: "Home", href: "#home", icon: Home },
    { name: "Track", href: "#track", icon: BarChart3 },
    { name: "History", href: "#history", icon: BarChart3 },
    { name: "Achievements", href: "#achievements", icon: Trophy },
    { name: "Leaderboard", href: "#leaderboard", icon: Crown },
    { name: "About", href: "#about", icon: Info },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={cemitrackLogo} 
              alt="EcoPulse Logo" 
className="h-30 w-auto object-contain"
              style={{ filter: 'drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white)' }}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            ))}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Open navigation menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center pb-6 border-b border-border">
                    <img 
                      src={cemitrackLogo} 
                      alt="EcoPulse Logo" 
className="h-30 w-auto object-contain"
                      style={{ filter: 'drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white)' }}
                    />
                  </div>
                  
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="flex items-center space-x-3 text-left p-3 rounded-lg hover:bg-muted transition-colors duration-200"
                    >
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="text-lg">{item.name}</span>
                    </button>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-left p-3 rounded-lg hover:bg-destructive/10 text-destructive w-full justify-start"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-lg">Logout</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}