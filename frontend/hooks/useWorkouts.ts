import { useWorkouts as useWorkoutsFromContext } from '@/providers/WorkoutProvider';

export function useWorkouts() {
  return useWorkoutsFromContext();
}