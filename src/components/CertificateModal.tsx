import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    name: string;
    description: string;
    icon: any;
    color: string;
  } | null;
  userName?: string;
}

export function CertificateModal({ isOpen, onClose, achievement, userName = "YES-O Student" }: CertificateModalProps) {
  if (!achievement) return null;

  const Icon = achievement.icon;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="relative p-8 sm:p-12">
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-primary/30" />
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-primary/30" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-primary/30" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-primary/30" />
          
          {/* Decorative stars */}
          <Star className="absolute top-8 right-16 w-4 h-4 text-accent opacity-50 animate-pulse" />
          <Star className="absolute bottom-8 left-16 w-4 h-4 text-accent opacity-50 animate-pulse delay-100" />
          <Star className="absolute top-24 left-12 w-3 h-3 text-accent opacity-30 animate-pulse delay-200" />

          <div className="text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <Award className="w-12 h-12 mx-auto text-accent" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Certificate of Recognition
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </div>

            {/* Body */}
            <div className="space-y-6 py-6">
              <p className="text-muted-foreground text-lg">
                This is to certify that
              </p>
              
              <h3 className="text-3xl font-bold text-primary">
                {userName}
              </h3>
              
              <p className="text-muted-foreground text-lg">
                has successfully earned the
              </p>

              {/* Achievement Badge */}
              <div className="inline-block">
                <div 
                  className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-glow"
                  style={{ backgroundColor: `${achievement.color}20` }}
                >
                  <Icon 
                    className="w-16 h-16" 
                    style={{ color: achievement.color }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full animate-pulse" 
                    style={{ backgroundColor: `${achievement.color}10` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-foreground">
                  {achievement.name}
                </h4>
                <p className="text-muted-foreground">
                  {achievement.description}
                </p>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Awarded on {currentDate}
                </p>
              </div>

              {/* Signature line */}
              <div className="pt-8 flex justify-center gap-16">
                <div className="text-center">
                  <div className="h-px w-32 bg-border mb-2" />
                  <p className="text-xs text-muted-foreground">YES-O Program</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <Button 
              onClick={onClose}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
