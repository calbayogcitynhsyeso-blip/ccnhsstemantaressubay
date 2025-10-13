-- Drop the existing view and recreate it with SECURITY INVOKER (default)
-- This ensures the view runs with querying user's permissions, not the creator's
DROP VIEW IF EXISTS public.leaderboard_stats;

CREATE VIEW public.leaderboard_stats 
WITH (security_invoker = true) AS
SELECT 
    p.user_id,
    p.display_name,
    p.grade,
    p.section,
    COALESCE(AVG(al.total_carbon), 0) as avg_carbon_score,
    COUNT(DISTINCT al.log_date) as streak_days,
    MAX(al.log_date) as last_activity_date
FROM public.profiles p
LEFT JOIN public.activity_logs al ON p.user_id = al.user_id
GROUP BY p.user_id, p.display_name, p.grade, p.section;

-- Grant SELECT access to the leaderboard view for all authenticated users
GRANT SELECT ON public.leaderboard_stats TO authenticated;

COMMENT ON VIEW public.leaderboard_stats IS 'Public leaderboard statistics with SECURITY INVOKER. Readable by all authenticated users for competitive features.';