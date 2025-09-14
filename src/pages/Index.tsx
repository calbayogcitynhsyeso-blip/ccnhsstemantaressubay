import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ActivityLogger } from "@/components/ActivityLogger";
import { Achievements } from "@/components/Achievements";
import { About } from "@/components/About";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section id="track">
          <ActivityLogger />
        </section>
        
        <section id="achievements">
          <Achievements />
        </section>
        
        <section id="about">
          <About />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted/30 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 EcoPulse - Calbayog City National High School YES-O
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
