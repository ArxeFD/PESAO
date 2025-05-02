import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Dumbbell, Plus, Filter, TrendingUp, Clock } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import WorkoutCard from '@/components/workout/WorkoutCard';
import RecentExerciseCard from '@/components/exercises/RecentExerciseCard';
import { useWorkouts } from '@/hooks/useWorkouts';

export default function HomeScreen() {
  const router = useRouter();
  const { recentWorkouts } = useWorkouts();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>HEVY</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter color={theme.colors.textPrimary} size={20} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.newWorkoutButton}
            onPress={() => router.push('/workout/new')}
          >
            <View style={styles.buttonIcon}>
              <Dumbbell color="#fff" size={22} />
            </View>
            <Text style={styles.buttonText}>New Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.routineButton}
            onPress={() => router.push('/workout/templates')}
          >
            <View style={[styles.buttonIcon, { backgroundColor: theme.colors.secondary }]}>
              <Plus color="#fff" size={22} />
            </View>
            <Text style={styles.buttonText}>Routines</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Workouts</Text>
            <TouchableOpacity onPress={() => router.push('/workouts')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout) => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                onPress={() => router.push(`/workout/${workout.id}`)} 
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Dumbbell size={48} color={theme.colors.border} />
              <Text style={styles.emptyStateText}>No recent workouts</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => router.push('/workout/new')}
              >
                <Text style={styles.emptyStateButtonText}>Start a Workout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Exercises</Text>
            <TouchableOpacity onPress={() => router.push('/exercises')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentExercisesContainer}
          >
            <RecentExerciseCard
              name="Bench Press"
              category="Chest"
              lastWeight="100 kg"
              icon={<TrendingUp size={16} color={theme.colors.success} />}
              iconLabel="+5 kg"
              onPress={() => router.push('/exercise/bench-press')}
            />
            <RecentExerciseCard
              name="Squat"
              category="Legs"
              lastWeight="140 kg"
              icon={<Clock size={16} color={theme.colors.warning} />}
              iconLabel="2 weeks ago"
              onPress={() => router.push('/exercise/squat')}
            />
            <RecentExerciseCard
              name="Pull Up"
              category="Back"
              lastWeight="BW+10 kg"
              icon={<TrendingUp size={16} color={theme.colors.success} />}
              iconLabel="+2.5 kg"
              onPress={() => router.push('/exercise/pull-up')}
            />
            <RecentExerciseCard
              name="Deadlift"
              category="Back"
              lastWeight="160 kg"
              icon={<Clock size={16} color={theme.colors.warning} />}
              iconLabel="1 week ago"
              onPress={() => router.push('/exercise/deadlift')}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logo: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: theme.colors.primary,
    letterSpacing: 1.2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  newWorkoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  routineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
  },
  buttonIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  seeAll: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  emptyState: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 12,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: theme.colors.white,
  },
  recentExercisesContainer: {
    paddingLeft: 20,
    paddingRight: 12,
  },
});