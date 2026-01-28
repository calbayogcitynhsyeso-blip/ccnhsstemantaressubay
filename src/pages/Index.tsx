import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ActivityLogger } from "@/components/ActivityLogger";
import { Achievements } from "@/components/Achievements";
import { Leaderboard } from "@/components/Leaderboard";
import { About } from "@/components/About";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section id="track" className="section-border-top relative">
          <div className="absolute top-10 right-20 w-24 h-24 bg-success/10 rounded-full blur-xl animate-pulse" />
          <ActivityLogger />
        </section>
        
        <section id="achievements" className="section-border-top section-border-secondary relative">
          <div className="absolute top-20 left-16 w-20 h-20 bg-accent/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          <Achievements />
        </section>
        
        <section id="leaderboard" className="section-border-top section-border-accent relative">
          <div className="absolute top-12 right-12 w-28 h-28 bg-eco-blue/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
          <Leaderboard />
        </section>
        
        <section id="about" className="section-border-top relative">
          <div className="absolute top-16 left-8 w-16 h-16 bg-earth-yellow/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          <About />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted/30 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 C0₂ - Antareans
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
