import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Car, Zap, UtensilsCrossed, Trash2, Plus, TrendingUp, Edit3 } from "lucide-react";

interface Activity {
  id: string;
  category: 'transport' | 'electricity' | 'food' | 'waste';
  name: string;
  carbonValue: number;
  unit: string;
}

const activities: Activity[] = [
  // Transport
  { id: 'walk', category: 'transport', name: 'Walking', carbonValue: 0, unit: 'km' },
  { id: 'bike', category: 'transport', name: 'Bicycle', carbonValue: 0, unit: 'km' },
  { id: 'ebike', category: 'transport', name: 'E-bike', carbonValue: 0.02, unit: 'km' },
  { id: 'motorcycle', category: 'transport', name: 'Motorcycle', carbonValue: 0.07, unit: 'km' },
  { id: 'jeepney', category: 'transport', name: 'Jeepney', carbonValue: 0.05, unit: 'km' },
  { id: 'bus', category: 'transport', name: 'Bus', carbonValue: 0.03, unit: 'km' },
  { id: 'car', category: 'transport', name: 'Private Car', carbonValue: 0.15, unit: 'km' },
  
  // Electricity (per hour of use)
  { id: 'lights', category: 'electricity', name: 'Classroom Lights', carbonValue: 0.1, unit: 'hours' },
  { id: 'fans', category: 'electricity', name: 'Electric Fans', carbonValue: 0.05, unit: 'hours' },
  { id: 'aircon', category: 'electricity', name: 'Air Conditioner', carbonValue: 0.8, unit: 'hours' },
  { id: 'computer', category: 'electricity', name: 'Computer/Laptop', carbonValue: 0.2, unit: 'hours' },
  { id: 'projector', category: 'electricity', name: 'Projector', carbonValue: 0.3, unit: 'hours' },
  
  // Food
  { id: 'meat-meal', category: 'food', name: 'Meat-based Meal', carbonValue: 2.5, unit: 'meals' },
  { id: 'vegetarian', category: 'food', name: 'Vegetarian Meal', carbonValue: 0.8, unit: 'meals' },
  { id: 'fastfood', category: 'food', name: 'Fast Food', carbonValue: 3.2, unit: 'meals' },
  { id: 'homecooked', category: 'food', name: 'Home-cooked Meal', carbonValue: 1.2, unit: 'meals' },
  { id: 'canteen', category: 'food', name: 'School Canteen', carbonValue: 1.5, unit: 'meals' },
  
  // Waste
  { id: 'plastic-bottle', category: 'waste', name: 'Plastic Bottle Used', carbonValue: 0.1, unit: 'items' },
  { id: 'plastic-sachet', category: 'waste', name: 'Plastic Sachet', carbonValue: 0.05, unit: 'items' },
  { id: 'recycling', category: 'waste', name: 'Recycling Action', carbonValue: -0.2, unit: 'items' },
  { id: 'composting', category: 'waste', name: 'Composting', carbonValue: -0.3, unit: 'kg' },
];

const categoryConfig = {
  transport: { icon: Car, color: 'bg-primary', name: 'Transport' },
  electricity: { icon: Zap, color: 'bg-accent', name: 'Electricity' },
  food: { icon: UtensilsCrossed, color: 'bg-success', name: 'Food' },
  waste: { icon: Trash2, color: 'bg-secondary', name: 'Waste' }
};

export function ActivityLogger() {
  const [selectedActivities, setSelectedActivities] = useState<{[key: string]: number}>({});
  const [activeCategory, setActiveCategory] = useState<string>('transport');
  const [editingActivity, setEditingActivity] = useState<string | null>(null);

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
    setSelectedActivities(prev => ({
      ...prev,
      [activityId]: Math.max(0, value)
    }));
  };

  const filteredActivities = activities.filter(a => a.category === activeCategory);

  return (
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
                    >
                      -
                    </Button>
                    {editingActivity === activity.id ? (
                      <Input
                        type="number"
                        min="0"
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
            onClick={() => {
              // TODO: Save activities to database
              alert(`Activities saved! Total carbon: ${totalCarbon.toFixed(2)} kg CO₂`);
            }}
          >
            Submit Activities
          </Button>
        </div>
      )}
    </section>
  );
}