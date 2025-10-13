import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingDown, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  rank: number;
  name: string;
  class: string;
  carbonScore: number;
  streak: number;
  badge?: string;
}

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all profiles with their activity logs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, grade, section');

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        setLeaderboardData([]);
        return;
      }

      // Fetch activity logs for all users
      const { data: activityLogs, error: logsError } = await supabase
        .from('activity_logs')
        .select('user_id, total_carbon, log_date');

      if (logsError) throw logsError;

      // Calculate average carbon score and streak for each user
      const userStats = profiles.map(profile => {
        const userLogs = activityLogs?.filter(log => log.user_id === profile.user_id) || [];
        
        if (userLogs.length === 0) {
          return null;
        }

        // Calculate average carbon score
        const totalCarbon = userLogs.reduce((sum, log) => sum + Number(log.total_carbon), 0);
        const averageCarbon = totalCarbon / userLogs.length;

        // Calculate streak (consecutive days with logs)
        const sortedDates = userLogs
          .map(log => new Date(log.log_date))
          .sort((a, b) => b.getTime() - a.getTime());
        
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < sortedDates.length; i++) {
          const logDate = new Date(sortedDates[i]);
          logDate.setHours(0, 0, 0, 0);
          const expectedDate = new Date(today);
          expectedDate.setDate(expectedDate.getDate() - i);
          
          if (logDate.getTime() === expectedDate.getTime()) {
            streak++;
          } else {
            break;
          }
        }

        return {
          name: profile.display_name,
          class: `${profile.grade} - ${profile.section}`,
          carbonScore: Number(averageCarbon.toFixed(1)),
          streak,
          userId: profile.user_id,
        };
      }).filter(stat => stat !== null) as Array<{
        name: string;
        class: string;
        carbonScore: number;
        streak: number;
        userId: string;
      }>;

      // Sort by carbon score (lower is better)
      const sortedStats = userStats.sort((a, b) => a.carbonScore - b.carbonScore);

      // Assign ranks and badges
      const leaderboard: LeaderboardEntry[] = sortedStats.map((stat, index) => ({
        rank: index + 1,
        name: stat.name,
        class: stat.class,
        carbonScore: stat.carbonScore,
        streak: stat.streak,
        badge: index === 0 ? "Eco Champion" : index === 1 ? "Green Warrior" : index === 2 ? "Nature Friend" : undefined,
      }));

      setLeaderboardData(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to real-time updates on activity_logs
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs'
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5" style={{color: 'hsl(45 90% 50%)'}} />;
      case 2:
        return <Medal className="w-5 h-5" style={{color: 'hsl(0 0% 70%)'}} />;
      case 3:
        return <Award className="w-5 h-5" style={{color: 'hsl(35 80% 55%)'}} />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return { backgroundColor: 'hsl(45 90% 50% / 0.1)', color: 'hsl(45 90% 40%)' };
    if (rank === 2) return { backgroundColor: 'hsl(0 0% 70% / 0.1)', color: 'hsl(0 0% 50%)' };
    if (rank === 3) return { backgroundColor: 'hsl(35 80% 55% / 0.1)', color: 'hsl(35 80% 45%)' };
    return {};
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="leaderboard" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Leaderboard
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          See how you rank against your classmates in reducing carbon footprint
        </p>
      </div>

      {/* Top 3 Spotlight or Empty State */}
      {leaderboardData.length === 0 ? (
        <Card className="bg-gradient-card border-0 shadow-medium max-w-2xl mx-auto mb-12">
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              No Rankings Yet
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              Be the first to start tracking your carbon footprint and claim the top spot!
            </p>
            <p className="text-muted-foreground text-sm">
              Log your daily activities to see your name appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {leaderboardData.slice(0, 3).map((entry) => (
            <Card 
              key={entry.rank} 
              className={`relative overflow-hidden transition-all duration-300 ${
                entry.rank === 1 
                  ? 'bg-gradient-card border-0 shadow-glow' 
                  : 'bg-gradient-card border border-border/50 shadow-medium'
              }`}
            >
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-3">
                  {getRankIcon(entry.rank)}
                </div>
                <CardTitle className="text-lg">{entry.name}</CardTitle>
                <CardDescription>{entry.class}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <div className="text-2xl font-bold mb-1" style={{color: 'hsl(142.1 76.2% 36.3%)'}}>
                    {entry.carbonScore} kg CO₂
                  </div>
                  <p className="text-muted-foreground text-sm">Daily Average</p>
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <TrendingDown className="w-4 h-4" style={{color: 'hsl(142.1 76.2% 36.3%)'}} />
                  <span className="text-sm text-muted-foreground">{entry.streak} day streak</span>
                </div>

                {entry.badge && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={getRankBadgeColor(entry.rank)}
                  >
                    {entry.badge}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Full Leaderboard Table */}
      {leaderboardData.length === 0 ? (
        <Card className="bg-gradient-card border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" style={{color: 'hsl(142.1 76.2% 36.3%)'}} />
              <span>Full Rankings</span>
            </CardTitle>
            <CardDescription>
              Rankings will appear here once students start logging activities
            </CardDescription>
          </CardHeader>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-2">Waiting for participants...</p>
              <p className="text-sm">Start tracking your carbon footprint to be the first on the leaderboard!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-card border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" style={{color: 'hsl(142.1 76.2% 36.3%)'}} />
              <span>Full Rankings</span>
            </CardTitle>
            <CardDescription>
              Rankings based on lowest average daily carbon footprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-right">Carbon Score</TableHead>
                  <TableHead className="text-right">Streak</TableHead>
                  <TableHead className="text-center">Badge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((entry) => (
                  <TableRow key={entry.rank} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.class}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium" style={{color: 'hsl(142.1 76.2% 36.3%)'}}>
                        {entry.carbonScore} kg CO₂
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <TrendingDown className="w-3 h-3" style={{color: 'hsl(142.1 76.2% 36.3%)'}} />
                        <span className="text-sm">{entry.streak} days</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.badge ? (
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={getRankBadgeColor(entry.rank)}
                        >
                          {entry.badge}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <div className="text-center mt-8">
        <p className="text-muted-foreground text-sm">
          Keep logging your activities to climb the leaderboard and earn badges!
        </p>
      </div>
    </section>
  );
}