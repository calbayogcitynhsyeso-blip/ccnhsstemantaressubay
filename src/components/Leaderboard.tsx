import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingDown, Users } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  class: string;
  carbonScore: number;
  streak: number;
  badge?: string;
}

// Mock leaderboard data
const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Maria Santos", class: "Grade 10-A", carbonScore: 2.1, streak: 15, badge: "Eco Champion" },
  { rank: 2, name: "Juan Dela Cruz", class: "Grade 11-B", carbonScore: 2.4, streak: 12, badge: "Green Warrior" },
  { rank: 3, name: "Anna Reyes", class: "Grade 10-C", carbonScore: 2.7, streak: 8, badge: "Nature Friend" },
  { rank: 4, name: "Carlos Mendoza", class: "Grade 9-A", carbonScore: 3.1, streak: 10 },
  { rank: 5, name: "Sofia Garcia", class: "Grade 11-A", carbonScore: 3.5, streak: 6 },
  { rank: 6, name: "Miguel Torres", class: "Grade 10-B", carbonScore: 3.8, streak: 5 },
  { rank: 7, name: "Isabella Cruz", class: "Grade 9-C", carbonScore: 4.2, streak: 7 },
  { rank: 8, name: "Diego Ramos", class: "Grade 11-C", carbonScore: 4.6, streak: 4 },
];

export function Leaderboard() {
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

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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