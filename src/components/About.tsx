import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Facebook, Users, Target, Leaf } from "lucide-react";

export function About() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          About EcoPulse
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          A project made by the CCNHS YES-Organization of Calbayog City National High School during the S.Y. of 2025-2026
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        {/* Mission & Vision */}
        <div className="space-y-8">
          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'var(--gradient-primary)'}}>
                  <Target className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">EcoPulse's Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To promote environmental awareness by helping students, teachers, and the school 
                community track and reduce their carbon footprint through simple daily habits. 
                By raising awareness of our impact on the planet, EcoPulse aims to encourage 
                sustainable practices within and beyond the school.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'var(--gradient-warm)'}}>
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">EcoPulse's Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                A future where every student is empowered with the knowledge and tools to make 
                environmentally conscious decisions, creating a ripple effect that transforms 
                our school, community, and planet for generations to come.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground mb-6">Why EcoPulse?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{backgroundColor: 'hsl(142.1 76.2% 36.3% / 0.2)'}}>
                <Users className="w-4 h-4" style={{color: 'hsl(142.1 76.2% 36.3%)'}} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Student-Friendly Design</h4>
                <p className="text-muted-foreground text-sm">
                  Built specifically for Filipino students with familiar activities and local context
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{backgroundColor: 'hsl(150 60% 60% / 0.2)'}}>
                <Target className="w-4 h-4" style={{color: 'hsl(150 60% 60%)'}} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Educational Focus</h4>
                <p className="text-muted-foreground text-sm">
                  Learn about environmental impact while building sustainable habits
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{backgroundColor: 'hsl(142.1 71.8% 29.2% / 0.2)'}}>
                <Leaf className="w-4 h-4" style={{color: 'hsl(142.1 71.8% 29.2%)'}} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Community Impact</h4>
                <p className="text-muted-foreground text-sm">
                  Compare progress with classmates and participate in school-wide initiatives
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-card rounded-3xl p-8 border border-border/50 shadow-medium">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Calbayog City National High School
          </h3>
          <p className="text-muted-foreground">
            CCNHS YES-Organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{background: 'var(--gradient-primary)'}}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Address</h4>
            <p className="text-muted-foreground text-sm">
              P2, Brgy. Hamorawon<br />
              Calbayog City, Samar<br />
              Philippines
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{background: 'var(--gradient-warm)'}}>
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Email</h4>
            <p className="text-muted-foreground text-sm">
              calbayogcitynhsyeso@gmail.com
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{backgroundColor: 'hsl(200 70% 45% / 0.2)'}}>
              <Facebook className="w-6 h-6" style={{color: 'hsl(200 70% 45%)'}} />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Follow Us</h4>
            <p className="text-muted-foreground text-sm">
              CCNHS YES-Organization
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            className="text-white hover:text-white"
            style={{
              borderColor: 'hsl(142.1 76.2% 36.3%)',
              backgroundColor: 'hsl(142.1 76.2% 36.3%)',
            }}
          >
            Contact CCNHS YES-Organization
          </Button>
        </div>
      </div>
    </section>
  );
}