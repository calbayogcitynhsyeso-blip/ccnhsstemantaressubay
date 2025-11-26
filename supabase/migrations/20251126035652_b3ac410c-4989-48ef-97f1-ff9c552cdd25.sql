-- Create a security definer function to get leaderboard stats
-- This bypasses RLS to allow all users to see the full leaderboard
CREATE OR REPLACE FUNCTION public.get_leaderboard_stats()
RETURNS TABLE (
  user_id uuid,
  display_name text,
  grade text,
  section text,
  avg_carbon_score numeric,
  streak_days bigint,
  last_activity_date date
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    p.display_name,
    p.grade,
    p.section,
    COALESCE(AVG(al.total_carbon), 0) as avg_carbon_score,
    COUNT(DISTINCT al.log_date) as streak_days,
    MAX(al.log_date) as last_activity_date
  FROM profiles p
  LEFT JOIN activity_logs al ON p.user_id = al.user_id
  GROUP BY p.user_id, p.display_name, p.grade, p.section
  ORDER BY avg_carbon_score DESC;
$$;