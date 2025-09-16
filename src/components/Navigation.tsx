import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, BarChart3, Trophy, Crown, Info } from "lucide-react";
import yesoLogo from "@/assets/yes-o-logo-cropped.png";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home", icon: Home },
    { name: "Track", href: "#track", icon: BarChart3 },
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
          <div className="flex items-center space-x-3">
            <img 
              src={yesoLogo} 
              alt="YES-O Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-primary">EcoPulse</span>
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
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center space-x-3 pb-6 border-b border-border">
                    <img 
                      src={yesoLogo} 
                      alt="YES-O Logo" 
                      className="w-10 h-10 object-contain"
                    />
                    <span className="text-xl font-bold text-primary">EcoPulse</span>
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}