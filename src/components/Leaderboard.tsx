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
  userId: string;
}

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      
      const { data: stats, error } = await supabase
        .rpc('get_leaderboard_stats');

      if (error) throw error;

      if (!stats || stats.length === 0) {
        setLeaderboardData([]);
        return;
      }

      const userStats = stats
        .filter(stat => stat.avg_carbon_score > 0)
        .map(stat => {
          let streak = stat.streak_days || 0;
          
          if (stat.last_activity_date) {
            const lastActivity = new Date(stat.last_activity_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            lastActivity.setHours(0, 0, 0, 0);
            
            const daysSinceLastActivity = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysSinceLastActivity > 1) {
              streak = 0;
            }
          }

          return {
            name: stat.display_name,
            class: `${stat.grade} - ${stat.section}`,
            carbonScore: Number(stat.avg_carbon_score.toFixed(1)),
            streak,
            userId: stat.user_id,
          };
        });

      const sortedStats = userStats.sort((a, b) => a.carbonScore - b.carbonScore);

      const leaderboard: LeaderboardEntry[] = sortedStats.map((stat, index) => ({
        rank: index + 1,
        name: stat.name,
        class: stat.class,
        carbonScore: stat.carbonScore,
        streak: stat.streak,
        badge: index === 0 ? "Eco Champion" : index === 1 ? "Green Warrior" : index === 2 ? "Nature Friend" : undefined,
        userId: stat.userId,
      }));

      setLeaderboardData(leaderboard);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Leaderboard fetch error code:', error?.code);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

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

  const top10 = leaderboardData.slice(0, 10);
  const currentUserEntry = leaderboardData.find(entry => entry.userId === currentUserId);
  const currentUserInTop10 = currentUserEntry && currentUserEntry.rank <= 10;

  const renderTableRow = (entry: LeaderboardEntry, isCurrentUser: boolean = false) => (
    <TableRow 
      key={entry.rank} 
      className={`hover:bg-muted/30 ${isCurrentUser ? 'bg-primary/10 border-l-4 border-l-primary' : ''}`}
    >
      <TableCell className="font-medium">
        <div className="flex items-center justify-center">
          {getRankIcon(entry.rank)}
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {entry.name}
        {isCurrentUser && <span className="ml-2 text-xs text-primary">(You)</span>}
      </TableCell>
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
  );

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
              } ${entry.userId === currentUserId ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-3">
                  {getRankIcon(entry.rank)}
                </div>
                <CardTitle className="text-lg">
                  {entry.name}
                  {entry.userId === currentUserId && <span className="ml-2 text-xs text-primary">(You)</span>}
                </CardTitle>
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
              <span>Top 10 Rankings</span>
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
                {top10.map((entry) => renderTableRow(entry, entry.userId === currentUserId))}
                
                {currentUserEntry && !currentUserInTop10 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-2 text-muted-foreground text-sm">
                        ・・・
                      </TableCell>
                    </TableRow>
                    {renderTableRow(currentUserEntry, true)}
                  </>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="text-center mt-8">
        <p className="text-muted-foreground text-sm">
          Keep logging your activities to climb the leaderboard and earn badges!
        </p>
      </div>
    </section>
  );
}