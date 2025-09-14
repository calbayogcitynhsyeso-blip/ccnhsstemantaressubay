import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Leaf, Recycle, Users, Target, Award, Lock } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'eco' | 'social' | 'milestone';
  color: string;
}

const achievements: Achievement[] = [
  {
    id: 'first-log',
    name: 'First Steps',
    description: 'Log your first activity',
    icon: Star,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    category: 'milestone',
    color: 'text-accent'
  },
  {
    id: 'plastic-free',
    name: 'Plastic-Free Warrior',
    description: 'Go 7 days without using plastic items',
    icon: Leaf,
    progress: 0,
    maxProgress: 7,
    unlocked: false,
    category: 'eco',
    color: 'text-success'
  },
  {
    id: 'recycling-hero',
    name: 'Recycling Hero',
    description: 'Complete 10 recycling activities',
    icon: Recycle,
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    category: 'eco',
    color: 'text-primary'
  },
  {
    id: 'low-carbon',
    name: 'Low Carbon Champion',
    description: 'Keep daily footprint under 3kg CO₂ for a week',
    icon: Trophy,
    progress: 0,
    maxProgress: 7,
    unlocked: false,
    category: 'milestone',
    color: 'text-accent'
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    description: 'Rank in top 10 of your class',
    icon: Users,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    category: 'social',
    color: 'text-secondary'
  },
  {
    id: 'eco-month',
    name: 'Eco Month Master',
    description: 'Log activities for 30 consecutive days',
    icon: Target,
    progress: 0,
    maxProgress: 30,
    unlocked: false,
    category: 'milestone',
    color: 'text-primary'
  },
];

const categoryConfig = {
  eco: { name: 'Environmental', color: 'bg-success/10 text-success' },
  social: { name: 'Community', color: 'bg-secondary/10 text-secondary' },
  milestone: { name: 'Milestone', color: 'bg-accent/10 text-accent' }
};

export function Achievements() {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Achievements & Badges
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
          Earn badges by completing eco-friendly challenges and milestones
        </p>
        
        {/* Overall Progress */}
        <Card className="bg-gradient-card border-0 shadow-medium max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Award className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Progress Overview</h3>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              {unlockedCount} / {totalCount}
            </div>
            <Progress value={(unlockedCount / totalCount) * 100} className="h-2" />
            <p className="text-muted-foreground text-sm mt-2">
              Achievements unlocked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Categories */}
      <div className="space-y-12">
        {Object.entries(categoryConfig).map(([categoryKey, categoryInfo]) => {
          const categoryAchievements = achievements.filter(a => a.category === categoryKey);
          
          return (
            <div key={categoryKey}>
              <div className="flex items-center space-x-3 mb-6">
                <Badge variant="secondary" className={categoryInfo.color}>
                  {categoryInfo.name}
                </Badge>
                <div className="h-px bg-border flex-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
                  
                  return (
                    <Card 
                      key={achievement.id} 
                      className={`relative overflow-hidden transition-all duration-300 ${
                        achievement.unlocked 
                          ? 'bg-gradient-card border-primary/50 shadow-glow' 
                          : 'bg-muted/30 border-border/50 shadow-soft'
                      }`}
                    >
                      {!achievement.unlocked && (
                        <div className="absolute top-3 right-3">
                          <Lock className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      )}
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.unlocked ? 'bg-primary/20' : 'bg-muted'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              achievement.unlocked ? achievement.color : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className={`text-lg ${
                              achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {achievement.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {achievement.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className={achievement.unlocked ? 'text-primary font-medium' : 'text-muted-foreground'}>
                              {achievement.progress} / {achievement.maxProgress}
                            </span>
                          </div>
                          <Progress 
                            value={progressPercentage} 
                            className="h-2"
                          />
                          {achievement.unlocked && (
                            <Badge variant="default" className="bg-success text-success-foreground">
                              ✓ Unlocked
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming Soon */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-secondary/10 border-secondary/20 shadow-soft max-w-lg mx-auto">
          <CardContent className="p-8">
            <Star className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              More Achievements Coming Soon!
            </h3>
            <p className="text-muted-foreground">
              We're working on exciting new challenges and community features. 
              Keep tracking your activities to unlock future achievements.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}