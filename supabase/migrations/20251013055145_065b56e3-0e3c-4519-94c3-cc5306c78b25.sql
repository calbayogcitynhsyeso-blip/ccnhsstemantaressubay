-- Fix critical data exposure: Restrict profiles SELECT policy to own data only
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Add missing DELETE policies
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity logs" 
ON public.activity_logs 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create a secure leaderboard view that aggregates public stats without exposing full profiles
-- This view will be readable by all authenticated users for the leaderboard feature
CREATE OR REPLACE VIEW public.leaderboard_stats AS
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

COMMENT ON VIEW public.leaderboard_stats IS 'Public leaderboard statistics aggregated from profiles and activity logs. Readable by all authenticated users for competitive features.';