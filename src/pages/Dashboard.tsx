import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { ActivityLogger } from "@/components/ActivityLogger";
import { Achievements } from "@/components/Achievements";
import { Leaderboard } from "@/components/Leaderboard";
import { About } from "@/components/About";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { CarbonHistory } from "@/components/CarbonHistory";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
        
        if (!newSession) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      if (!currentSession) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return null; // Will redirect to auth
  }

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
        
        <section id="history" className="section-border-top section-border-secondary relative">
          <div className="absolute top-16 left-12 w-20 h-20 bg-accent/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <CarbonHistory user={user} />
        </section>
        
        <section id="achievements" className="section-border-top section-border-secondary relative">
          <div className="absolute top-20 left-16 w-20 h-20 bg-accent/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          <Achievements user={user} />
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
            © 2024 CEmiTrack - Antareans
          </p>
        </div>
      </footer>
    </div>
  );
}