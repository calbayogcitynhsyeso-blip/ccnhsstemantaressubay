import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingDown, TrendingUp, History, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface ActivityLog {
  id: string;
  log_date: string;
  total_carbon: number;
  activities: Record<string, number>;
}

interface CarbonHistoryProps {
  user: User;
}

export function CarbonHistory({ user }: CarbonHistoryProps) {
  const [historyLogs, setHistoryLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setHistoryLogs((data || []).map(log => ({
        ...log,
        activities: log.activities as Record<string, number>
      })));
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (carbon: number) => {
    if (carbon < 3) return 'text-success';
    if (carbon < 6) return 'text-accent';
    return 'text-destructive';
  };

  const getScoreBadge = (carbon: number) => {
    if (carbon < 3) return { text: 'Excellent', variant: 'default' as const, color: 'bg-success' };
    if (carbon < 6) return { text: 'Good', variant: 'secondary' as const, color: 'bg-accent' };
    return { text: 'Needs Work', variant: 'destructive' as const, color: 'bg-destructive' };
  };

  const averageCarbon = historyLogs.length > 0 
    ? historyLogs.reduce((sum, log) => sum + Number(log.total_carbon), 0) / historyLogs.length 
    : 0;

  const trend = historyLogs.length >= 2 
    ? Number(historyLogs[0].total_carbon) - Number(historyLogs[1].total_carbon)
    : 0;

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Carbon Track History
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Review your daily carbon footprint progress and trends over time
        </p>
      </div>

      {/* Summary Stats */}
      {historyLogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Days Tracked</h3>
              </div>
              <div className="text-2xl font-bold text-primary">{historyLogs.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Leaf className="w-5 h-5 text-success" />
                <h3 className="font-semibold">Average CO₂</h3>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(averageCarbon)}`}>
                {averageCarbon.toFixed(2)} kg
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {trend <= 0 ? (
                  <TrendingDown className="w-5 h-5 text-success" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-destructive" />
                )}
                <h3 className="font-semibold">Trend</h3>
              </div>
              <div className={`text-2xl font-bold ${trend <= 0 ? 'text-success' : 'text-destructive'}`}>
                {trend <= 0 ? '↓' : '↑'} {Math.abs(trend).toFixed(2)} kg
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History List */}
      {historyLogs.length === 0 ? (
        <Card className="bg-gradient-card border-0 shadow-medium max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              No History Yet
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              Start tracking your daily activities to build your carbon footprint history.
            </p>
            <p className="text-muted-foreground text-sm">
              Your logged activities will appear here to help you track progress over time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyLogs.map((log) => {
            const badge = getScoreBadge(Number(log.total_carbon));
            const activityCount = Object.values(log.activities).reduce((sum, count) => sum + count, 0);
            
            return (
              <Card key={log.id} className="bg-gradient-card border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{formatDate(log.log_date)}</CardTitle>
                    <Badge 
                      variant={badge.variant}
                      className={badge.variant === 'default' ? badge.color : ''}
                    >
                      {badge.text}
                    </Badge>
                  </div>
                  <CardDescription>
                    {activityCount} activities logged
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(Number(log.total_carbon))}`}>
                        {Number(log.total_carbon).toFixed(2)} kg CO₂
                      </div>
                      <p className="text-muted-foreground text-sm">Total Carbon Score</p>
                    </div>
                    
                    {Object.keys(log.activities).length > 0 && (
                      <div className="pt-2 border-t border-border/20">
                        <p className="text-xs text-muted-foreground mb-1">Top Activities:</p>
                        <div className="text-xs text-muted-foreground">
                          {Object.entries(log.activities)
                            .filter(([_, count]) => count > 0)
                            .slice(0, 3)
                            .map(([activity, count]) => `${activity}: ${count}`)
                            .join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}