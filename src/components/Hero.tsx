import { Button } from "@/components/ui/button";
import { Leaf, TrendingDown, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Students engaging with environmental technology"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground">
                EcoPulse
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              Track your carbon footprint, make a difference.
              <br />
              <span className="text-lg opacity-80">Join CCNHS YES-O students in building a sustainable future</span>
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
              <TrendingDown className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Track Impact</h3>
              <p className="text-primary-foreground/80 text-sm">Log daily activities and see your carbon footprint in real-time</p>
            </div>
            <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
              <Users className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Community</h3>
              <p className="text-primary-foreground/80 text-sm">Compare with classmates and compete for sustainability goals</p>
            </div>
            <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
              <Award className="w-8 h-8 text-success mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Achievements</h3>
              <p className="text-primary-foreground/80 text-sm">Earn badges and rewards for eco-friendly actions</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4 mt-12">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold rounded-full shadow-strong hover:shadow-glow transition-all duration-300"
            >
              Start Tracking Now
            </Button>
            <p className="text-primary-foreground/70 text-sm">
              Free for all CCNHS students • Available on mobile
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-success/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-5 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  );
}