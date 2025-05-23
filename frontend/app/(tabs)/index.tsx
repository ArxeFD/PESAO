import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Dumbbell, Plus, Filter, TrendingUp, Clock, ChevronDown } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import WorkoutCard from '@/components/workout/WorkoutCard';
import RecentExerciseCard from '@/components/exercises/RecentExerciseCard';
import { useWorkouts } from '@/hooks/useWorkouts';

type SortOption = 'most_recent' | 'oldest' | 'most_volume' | 'most_sets';

export default function HomeScreen() {
  const router = useRouter();
  const { workouts, sortWorkouts, isLoading, error, refetch } = useWorkouts();
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('most_recent');
  const [displayedWorkouts, setDisplayedWorkouts] = useState(workouts);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (workouts.length > 0) {
      const sorted = sortWorkouts(currentSort);
      setDisplayedWorkouts(sorted.slice(0, 3));
    } else {
      setDisplayedWorkouts([]);
    }
  }, [workouts, currentSort]);

  const handleSort = (option: SortOption) => {
    setCurrentSort(option);
    setShowFilterMenu(false);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing workouts:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.logo}>PESAO</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter color={theme.colors.textPrimary} size={20} />
            </TouchableOpacity>
            
            {showFilterMenu && (
              <View style={styles.filterMenu}>
                <TouchableOpacity 
                  style={[styles.filterOption, currentSort === 'most_recent' && styles.selectedFilter]}
                  onPress={() => handleSort('most_recent')}
                >
                  <Text style={[styles.filterText, currentSort === 'most_recent' && styles.selectedFilterText]}>
                    Most Recent
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterOption, currentSort === 'oldest' && styles.selectedFilter]}
                  onPress={() => handleSort('oldest')}
                >
                  <Text style={[styles.filterText, currentSort === 'oldest' && styles.selectedFilterText]}>
                    Oldest
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterOption, currentSort === 'most_volume' && styles.selectedFilter]}
                  onPress={() => handleSort('most_volume')}
                >
                  <Text style={[styles.filterText, currentSort === 'most_volume' && styles.selectedFilterText]}>
                    Most Volume
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterOption, currentSort === 'most_sets' && styles.selectedFilter]}
                  onPress={() => handleSort('most_sets')}
                >
                  <Text style={[styles.filterText, currentSort === 'most_sets' && styles.selectedFilterText]}>
                    Most Sets
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {currentSort === 'most_recent' && 'Recent Workouts'}
              {currentSort === 'oldest' && 'Oldest Workouts'}
              {currentSort === 'most_volume' && 'Highest Volume'}
              {currentSort === 'most_sets' && 'Most Sets'}
            </Text>
            <TouchableOpacity onPress={() => router.push('/workouts')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Loading workouts...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{error}</Text>
            </View>
          ) : displayedWorkouts.length > 0 ? (
            displayedWorkouts.map((workout) => (
              <WorkoutCard 
                key={workout._id} 
                workout={workout} 
                onPress={() => router.push(`/workout/${workout._id}`)} 
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Dumbbell size={48} color={theme.colors.border} />
              <Text style={styles.emptyStateText}>No recent workouts</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => router.push('/new-workout')}
              >
                <Text style={styles.emptyStateButtonText}>Start a Workout</Text>
              </TouchableOpacity>
            </View>
          )}
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
  filterContainer: {
    position: 'relative',
  },
  filterMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedFilter: {
    backgroundColor: theme.colors.primary + '20',
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  selectedFilterText: {
    color: theme.colors.primary,
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
    justifyContent: 'center',

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
    textAlign: 'center'
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