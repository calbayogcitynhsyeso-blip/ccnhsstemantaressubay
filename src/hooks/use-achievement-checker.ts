import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  checkCondition: (data: any) => boolean;
}

export function useAchievementChecker() {
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const checkAndUnlockAchievements = useCallback(async (
    userId: string,
    achievements: Achievement[],
    checkData: any
  ) => {
    try {
      // Get currently unlocked achievements
      const { data: unlockedAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      const unlockedIds = new Set(unlockedAchievements?.map(a => a.achievement_id) || []);

      // Check each achievement
      for (const achievement of achievements) {
        // Skip if already unlocked
        if (unlockedIds.has(achievement.id)) continue;

        // Client-side pre-check (server validates authoritatively)
        if (achievement.checkCondition(checkData)) {
          // Call server-side function that validates conditions before inserting
          const { data: unlocked, error } = await supabase
            .rpc('unlock_achievement', {
              _achievement_id: achievement.id,
              _achievement_name: achievement.name
            });

          if (!error && unlocked) {
            // Show certificate for the first unlocked achievement
            setNewAchievement(achievement);
            return achievement;
          }
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }

    return null;
  }, []);

  const clearAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  return {
    newAchievement,
    checkAndUnlockAchievements,
    clearAchievement
  };
}
