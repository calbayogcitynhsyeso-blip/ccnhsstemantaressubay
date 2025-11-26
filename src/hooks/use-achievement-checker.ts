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

        // Check if condition is met
        if (achievement.checkCondition(checkData)) {
          // Unlock the achievement
          const { error } = await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
              achievement_name: achievement.name
            });

          if (!error) {
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
