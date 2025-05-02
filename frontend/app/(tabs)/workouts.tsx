import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { useRouter } from 'expo-router';
import { useWorkouts } from '@/hooks/useWorkouts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import EmptyState from '@/components/ui/EmptyState';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { workouts } = useWorkouts();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const nextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const filteredWorkouts = workouts.filter(
    workout => isSameDay(new Date(workout.date), selectedDate)
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout History</Text>
      </View>

      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={previousMonth} style={styles.calendarArrow}>
          <ChevronLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.calendarMonth}>
          {format(currentMonth, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.calendarArrow}>
          <ChevronRight size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <FlatList
          data={monthDays}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = isSameDay(item, selectedDate);
            const hasWorkout = workouts.some(workout => 
              isSameDay(new Date(workout.date), item)
            );
            
            return (
              <TouchableOpacity
                style={[
                  styles.calendarDay,
                  isSelected && styles.selectedDay
                ]}
                onPress={() => setSelectedDate(item)}
              >
                <Text style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText
                ]}>
                  {format(item, 'd')}
                </Text>
                <Text style={[
                  styles.weekdayText,
                  isSelected && styles.selectedDayText
                ]}>
                  {format(item, 'EEE')}
                </Text>
                {hasWorkout && (
                  <View style={[
                    styles.workoutIndicator,
                    isSelected && styles.selectedWorkoutIndicator
                  ]} />
                )}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.toISOString()}
          contentContainerStyle={styles.calendarList}
        />
      </View>

      <View style={styles.workoutsContainer}>
        <View style={styles.workoutsHeader}>
          <Text style={styles.workoutsHeaderDate}>
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </Text>
          {filteredWorkouts.length > 0 && (
            <Text style={styles.workoutsCount}>
              {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {filteredWorkouts.length > 0 ? (
          <FlatList
            data={filteredWorkouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <WorkoutCard 
                workout={item}
                onPress={() => router.push(`/workout/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.workoutsList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        ) : (
          <EmptyState
            icon={<CalendarDays size={48} color={theme.colors.border} />}
            title="No workouts found"
            description={`You don't have any workouts on ${format(selectedDate, 'MMMM d, yyyy')}`}
            actionLabel="Start a Workout"
            onAction={() => router.push('/workout/new')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  calendarArrow: {
    padding: 8,
  },
  calendarMonth: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: theme.colors.textPrimary,
  },
  calendarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 16,
  },
  calendarList: {
    paddingHorizontal: 12,
  },
  calendarDay: {
    width: 50,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
  },
  selectedDay: {
    backgroundColor: theme.colors.primary,
  },
  dayText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  weekdayText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  selectedDayText: {
    color: theme.colors.white,
  },
  workoutIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    bottom: 8,
  },
  selectedWorkoutIndicator: {
    backgroundColor: theme.colors.white,
  },
  workoutsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  workoutsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutsHeaderDate: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  workoutsCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  workoutsList: {
    paddingBottom: 100,
  },
});