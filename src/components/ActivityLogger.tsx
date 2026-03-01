import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Car, Zap, UtensilsCrossed, Trash2, Plus, TrendingUp, Edit3, Star, Leaf, Recycle, Trophy, TreeDeciduous } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { CertificateModal } from "./CertificateModal";
import { useAchievementChecker } from "@/hooks/use-achievement-checker";

interface Activity {
  id: string;
  category: 'transport' | 'electricity' | 'food' | 'waste' | 'offset';
  name: string;
  carbonValue: number;
  unit: string;
}

const activities: Activity[] = [
  // Transport
  { id: 'walk', category: 'transport', name: 'Walking', carbonValue: 0, unit: 'km' },
  { id: 'bike', category: 'transport', name: 'Bicycle', carbonValue: 0, unit: 'km' },
  { id: 'pedicab', category: 'transport', name: 'Pedicab (Padyak)', carbonValue: 0, unit: 'km' },
  { id: 'ebike', category: 'transport', name: 'E-bike', carbonValue: 0.02, unit: 'km' },
  { id: 'tricycle', category: 'transport', name: 'Tricycle (Timbol)', carbonValue: 0.06, unit: 'km' },
  { id: 'center-car', category: 'transport', name: 'Center Car', carbonValue: 0.08, unit: 'km' },
  { id: 'motorcycle', category: 'transport', name: 'Motorcycle', carbonValue: 0.07, unit: 'km' },
  { id: 'jeepney', category: 'transport', name: 'Jeepney', carbonValue: 0.05, unit: 'km' },
  { id: 'bus', category: 'transport', name: 'Bus', carbonValue: 0.03, unit: 'km' },
  { id: 'van', category: 'transport', name: 'Van', carbonValue: 0.12, unit: 'km' },
  { id: 'car', category: 'transport', name: 'Private Car', carbonValue: 0.15, unit: 'km' },
  
  // Electricity (per hour of use)
  { id: 'lights', category: 'electricity', name: 'Classroom Lights', carbonValue: 0.1, unit: 'hours' },
  { id: 'fans', category: 'electricity', name: 'Electric Fans', carbonValue: 0.05, unit: 'hours' },
  { id: 'aircon', category: 'electricity', name: 'Air Conditioner', carbonValue: 0.8, unit: 'hours' },
  { id: 'computer', category: 'electricity', name: 'Computer/Laptop', carbonValue: 0.2, unit: 'hours' },
  { id: 'projector', category: 'electricity', name: 'Projector', carbonValue: 0.3, unit: 'hours' },
  { id: 'tv', category: 'electricity', name: 'TV/Television', carbonValue: 0.15, unit: 'hours' },
  { id: 'cellphone', category: 'electricity', name: 'Cellphone', carbonValue: 0.01, unit: 'hours' },
  { id: 'dispenser', category: 'electricity', name: 'Dispenser', carbonValue: 0.12, unit: 'hours' },
  { id: 'printer', category: 'electricity', name: 'Printer', carbonValue: 0.08, unit: 'hours' },
  
  // Food
  { id: 'junk-foods', category: 'food', name: 'Junk Foods', carbonValue: 0.15, unit: 'items' },
  { id: 'biscuit-snacks', category: 'food', name: 'Biscuit Snacks', carbonValue: 0.08, unit: 'items' },
  { id: 'finger-foods', category: 'food', name: 'Finger Foods', carbonValue: 0.12, unit: 'items' },
  { id: 'food-on-stick', category: 'food', name: 'Food-on-a-Stick', carbonValue: 0.1, unit: 'items' },
  { id: 'rice-bowls', category: 'food', name: 'Rice Bowls', carbonValue: 0.8, unit: 'items' },
  { id: 'bottled-water', category: 'food', name: 'Bottled Water', carbonValue: 0.1, unit: 'items' },
  { id: 'bottled-juice', category: 'food', name: 'Bottled Juice', carbonValue: 0.12, unit: 'items' },
  { id: 'energy-drinks', category: 'food', name: 'Energy Drinks', carbonValue: 0.15, unit: 'items' },
  { id: 'softdrinks', category: 'food', name: 'Softdrinks', carbonValue: 0.12, unit: 'items' },
  { id: 'juice-packs', category: 'food', name: 'Juice Packs', carbonValue: 0.08, unit: 'items' },
  { id: 'fizz-drinks', category: 'food', name: 'Fizz Drinks', carbonValue: 0.1, unit: 'items' },
  { id: 'iced-coffee', category: 'food', name: 'Iced Coffee', carbonValue: 0.2, unit: 'items' },
  { id: 'ice-cream', category: 'food', name: 'Ice Cream / Frozen Yogurt', carbonValue: 0.25, unit: 'items' },
  { id: 'candies', category: 'food', name: 'Candies / Gummies', carbonValue: 0.05, unit: 'items' },
  
  // Waste
  { id: 'plastic-bottle', category: 'waste', name: 'Plastic Bottle Used', carbonValue: 0.1, unit: 'items' },
  { id: 'paper-used', category: 'waste', name: 'Paper Used', carbonValue: 0.05, unit: 'items' },
  { id: 'plastic-used', category: 'waste', name: 'Plastic Used', carbonValue: 0.08, unit: 'items' },
  { id: 'food-thrown', category: 'waste', name: 'Food Thrown', carbonValue: 0.2, unit: 'items' },
  
  // Offset (Eco-practices that reduce carbon footprint)
  { id: 'trees-planted', category: 'offset', name: 'Trees Planted', carbonValue: -5.0, unit: 'trees' },
  { id: 'gardening', category: 'offset', name: 'Gardening', carbonValue: -0.5, unit: 'hours' },
  { id: 'waste-segregated', category: 'offset', name: 'Waste Segregated', carbonValue: -0.1, unit: 'items' },
  { id: 'conserved-electricity', category: 'offset', name: 'Conserved Electricity', carbonValue: -0.3, unit: 'hours' },
  { id: 'conserved-water', category: 'offset', name: 'Conserved Water', carbonValue: -0.2, unit: 'liters' },
  { id: 'composting', category: 'offset', name: 'Composting', carbonValue: -0.15, unit: 'kg' },
  { id: 'reusable-bags', category: 'offset', name: 'Used Reusable Bags', carbonValue: -0.05, unit: 'uses' },
  { id: 'carpooling', category: 'offset', name: 'Carpooling', carbonValue: -0.1, unit: 'km' },
  { id: 'recycling', category: 'offset', name: 'Recycling', carbonValue: -0.08, unit: 'items' },
  { id: 'refillable-water', category: 'offset', name: 'Used Refillable Water Bottle', carbonValue: -0.1, unit: 'uses' },
];

const categoryConfig = {
  transport: { icon: Car, color: 'bg-primary', name: 'Transport' },
  electricity: { icon: Zap, color: 'bg-accent', name: 'Electricity' },
  food: { icon: UtensilsCrossed, color: 'bg-success', name: 'Food' },
  waste: { icon: Trash2, color: 'bg-secondary', name: 'Waste' },
  offset: { icon: TreeDeciduous, color: 'bg-success', name: 'Offset' }
};

// Achievement definitions for checking
const achievementDefinitions = [
  {
    id: 'first-log',
    name: 'First Steps',
    description: 'Log your first activity',
    icon: Star,
    color: 'hsl(45 90% 60%)',
    checkCondition: (data: any) => data.activityCount >= 1
  },
  {
    id: 'recycling-hero',
    name: 'Recycling Hero',
    description: 'Complete 10 recycling activities',
    icon: Recycle,
    color: 'hsl(200 70% 45%)',
    checkCondition: (data: any) => data.recyclingCount >= 10
  },
  {
    id: 'low-carbon',
    name: 'Low Carbon Champion',
    description: 'Keep daily footprint under 3kg CO₂ for a week',
    icon: Trophy,
    color: 'hsl(45 90% 50%)',
    checkCondition: (data: any) => data.lowCarbonDays >= 7
  }
];

export function ActivityLogger() {
  const [selectedActivities, setSelectedActivities] = useState<{[key: string]: number}>({});
  const [activeCategory, setActiveCategory] = useState<string>('transport');
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const { toast } = useToast();
  const { newAchievement, checkAndUnlockAchievements, clearAchievement } = useAchievementChecker();

  useEffect(() => {
    // Get current user and profile
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Get user's profile for display name
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setUserName(profile.display_name);
        }
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const totalCarbon = Object.entries(selectedActivities).reduce((total, [activityId, quantity]) => {
    const activity = activities.find(a => a.id === activityId);
    return total + (activity ? activity.carbonValue * quantity : 0);
  }, 0);

  const updateActivity = (activityId: string, change: number) => {
    setSelectedActivities(prev => ({
      ...prev,
      [activityId]: Math.max(0, (prev[activityId] || 0) + change)
    }));
  };

  const setActivityValue = (activityId: string, value: number) => {
    // Validate input with Zod schema
    const activityQuantitySchema = z.number()
      .min(0, "Quantity cannot be negative")
      .max(1000, "Please enter a realistic value (max 1000)")
      .finite("Invalid number");

    const validation = activityQuantitySchema.safeParse(value);
    
    if (!validation.success) {
      toast({
        title: "Invalid quantity",
        description: validation.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }

    setSelectedActivities(prev => ({
      ...prev,
      [activityId]: validation.data
    }));
  };

  const checkAchievements = async (userId: string, carbonScore: number) => {
    try {
      // Get user's activity history
      const { data: activityLogs } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('log_date', { ascending: false });

      if (!activityLogs) return;

      // Calculate achievement data
      const activityCount = activityLogs.length;
      const recyclingCount = activityLogs.reduce((sum, log) => {
        const activities = log.activities as any;
        return sum + (activities['recycling'] || 0);
      }, 0);
      
      // Count consecutive days with low carbon (< 3kg)
      let lowCarbonDays = 0;
      for (const log of activityLogs) {
        if (log.total_carbon < 3) {
          lowCarbonDays++;
        } else {
          break;
        }
      }

      const checkData = {
        activityCount,
        recyclingCount,
        lowCarbonDays,
        currentCarbon: carbonScore
      };

      // Check and unlock achievements
      await checkAndUnlockAchievements(userId, achievementDefinitions, checkData);
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const filteredActivities = activities.filter(a => a.category === activeCategory);

  const handleSubmitActivities = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save activities.",
        variant: "destructive",
      });
      return;
    }

    if (Object.keys(selectedActivities).length === 0) {
      toast({
        title: "No activities to save",
        description: "Please select some activities before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('activity_logs')
        .upsert({
          user_id: user.id,
          log_date: new Date().toISOString().split('T')[0], // Today's date
          activities: selectedActivities,
          total_carbon: totalCarbon,
        }, {
          onConflict: 'user_id,log_date'
        });

      if (error) throw error;

      toast({
        title: "Activities saved!",
        description: `Your carbon footprint of ${totalCarbon.toFixed(2)} kg CO₂ has been recorded.`,
      });

      // Check for achievements
      await checkAchievements(user.id, totalCarbon);

      // Reset form
      setSelectedActivities({});

    } catch (error: any) {
      // Log minimal info for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Activity save error code:', error?.code);
      }
      
      toast({
        title: "Error saving activities",
        description: "Unable to save your activities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <CertificateModal
        isOpen={!!newAchievement}
        onClose={clearAchievement}
        achievement={newAchievement}
        userName={userName}
      />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Log Your Daily Activities
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Track your environmental impact by logging activities in these key areas
        </p>
      </div>

      {/* Carbon Score Display */}
      <div className="mb-8">
        <Card className="bg-gradient-card border-0 shadow-medium">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Today's Carbon Score</h3>
            </div>
            <div className="text-4xl font-bold mb-1" style={{color: 'hsl(142.1 76.2% 36.3%)'}}>
              {totalCarbon.toFixed(2)} kg CO₂
            </div>
            <p className="text-muted-foreground text-sm">
              {totalCarbon < 5 ? "Great job! Keep it green!" : 
               totalCarbon < 10 ? "Good progress, room for improvement" : 
               "Let's work on reducing your footprint"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "outline"}
              onClick={() => setActiveCategory(key)}
              className={`${activeCategory === key ? config.color : ''} flex items-center space-x-2`}
            >
              <Icon className="w-4 h-4" />
              <span>{config.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => {
          const quantity = selectedActivities[activity.id] || 0;
          const categoryInfo = categoryConfig[activity.category];
          
          return (
            <Card key={activity.id} className="bg-gradient-card border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{activity.name}</CardTitle>
                  <Badge 
                    variant={activity.carbonValue < 0 ? "default" : "secondary"}
                    className={activity.carbonValue < 0 ? "bg-success" : ""}
                  >
                    {activity.carbonValue < 0 ? "Reduces CO₂" : `${activity.carbonValue} kg CO₂/${activity.unit}`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateActivity(activity.id, -1)}
                      disabled={quantity === 0}
                      className="w-8 h-8 p-0"
                      aria-label={`Decrease ${activity.name} quantity`}
                    >
                      -
                    </Button>
                    {editingActivity === activity.id ? (
                      <Input
                        type="number"
                        min="0"
                        max="1000"
                        step="0.1"
                        value={quantity}
                        onChange={(e) => setActivityValue(activity.id, parseFloat(e.target.value) || 0)}
                        onBlur={() => setEditingActivity(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingActivity(null)}
                        className="w-20 h-8 text-center"
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="font-semibold min-w-[3rem] text-center cursor-pointer hover:bg-muted rounded px-2 py-1 flex items-center space-x-1"
                        onClick={() => setEditingActivity(activity.id)}
                      >
                        <span>{quantity} {activity.unit}</span>
                        <Edit3 className="w-3 h-3 opacity-50" />
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateActivity(activity.id, 1)}
                      className="w-8 h-8 p-0"
                      aria-label={`Increase ${activity.name} quantity`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {quantity > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {(activity.carbonValue * quantity).toFixed(2)} kg CO₂
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      {Object.keys(selectedActivities).length > 0 && (
        <div className="mt-8 text-center">
          <Button 
            size="lg"
            className="bg-success hover:bg-success/90 text-success-foreground px-8 py-3 text-lg font-semibold rounded-full"
            onClick={handleSubmitActivities}
            disabled={saving || !user}
          >
            {saving ? "Saving..." : "Submit Activities"}
          </Button>
          {!user && (
            <p className="text-muted-foreground text-sm mt-2">
              Please log in to save your activities
            </p>
          )}
        </div>
      )}
    </section>
    </>
  );
}