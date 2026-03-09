
-- Create a server-side function to validate and unlock achievements
CREATE OR REPLACE FUNCTION public.unlock_achievement(
  _achievement_id text,
  _achievement_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
  _activity_count bigint;
  _recycling_count numeric;
  _low_carbon_days bigint;
  _already_unlocked boolean;
BEGIN
  -- Get the authenticated user
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if already unlocked
  SELECT EXISTS(
    SELECT 1 FROM user_achievements
    WHERE user_id = _user_id AND achievement_id = _achievement_id
  ) INTO _already_unlocked;

  IF _already_unlocked THEN
    RETURN false;
  END IF;

  -- Validate achievement conditions server-side
  IF _achievement_id = 'first-log' THEN
    SELECT COUNT(*) INTO _activity_count
    FROM activity_logs WHERE user_id = _user_id;
    
    IF _activity_count < 1 THEN
      RETURN false;
    END IF;

  ELSIF _achievement_id = 'recycling-hero' THEN
    SELECT COALESCE(SUM(
      COALESCE((activities->>'recycling')::numeric, 0)
    ), 0) INTO _recycling_count
    FROM activity_logs WHERE user_id = _user_id;
    
    IF _recycling_count < 10 THEN
      RETURN false;
    END IF;

  ELSIF _achievement_id = 'low-carbon' THEN
    SELECT COUNT(*) INTO _low_carbon_days
    FROM (
      SELECT log_date FROM activity_logs
      WHERE user_id = _user_id AND total_carbon < 3
      ORDER BY log_date DESC
      LIMIT 7
    ) sub;
    
    IF _low_carbon_days < 7 THEN
      RETURN false;
    END IF;

  ELSE
    -- Unknown achievement
    RETURN false;
  END IF;

  -- Insert the achievement
  INSERT INTO user_achievements (user_id, achievement_id, achievement_name)
  VALUES (_user_id, _achievement_id, _achievement_name);

  RETURN true;
END;
$$;

-- Drop the old permissive INSERT policy and replace with one that only allows the function
DROP POLICY IF EXISTS "Users can insert their own achievements" ON user_achievements;

-- Create a restrictive policy that denies direct client inserts
-- Only the SECURITY DEFINER function above can insert
CREATE POLICY "No direct client inserts on achievements"
ON user_achievements
FOR INSERT
TO authenticated
WITH CHECK (false);
