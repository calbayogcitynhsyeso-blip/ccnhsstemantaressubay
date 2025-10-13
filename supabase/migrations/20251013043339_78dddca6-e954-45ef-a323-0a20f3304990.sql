-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that restricts viewing to authenticated users only
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- This ensures only logged-in users can see profile information,
-- which is necessary for the leaderboard functionality while
-- preventing public/unauthenticated access to student data