import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { ChevronDown, ChartBar as BarChart3 } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useExercises } from '@/hooks/useExercises';
import ProgressExerciseItem from '@/components/progress/ProgressExerciseItem';
import EmptyState from '@/components/ui/EmptyState';
import { format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const { workouts } = useWorkouts();
  const { exercises } = useExercises();
  const [selectedExercise, setSelectedExercise] = useState(
    exercises.length > 0 ? exercises[0]._id : ''
  );
  const [chartType, setChartType] = useState<'weight' | 'volume'>('weight');

  // Get selected exercise data
  const selectedExerciseData = exercises.find(ex => ex._id === selectedExercise);

  // Get workout history for the selected exercise
  const exerciseHistory = workouts
    .filter(workout =>
      workout.exercises.some(ex => {
        const exerciseId = typeof ex.exerciseId === 'string'
          ? ex.exerciseId
          : ex.exerciseId._id;
        return exerciseId === selectedExercise;
      })
    )
    .map(workout => {
      const exerciseData = workout.exercises.find(ex => {
        const exerciseId = typeof ex.exerciseId === 'string'
          ? ex.exerciseId
          : ex.exerciseId._id;
        return exerciseId === selectedExercise;
      });
      if (!exerciseData) return null;

      const maxWeight = Math.max(...exerciseData.sets.map(set => set.weight));
      const totalVolume = exerciseData.sets.reduce((total, set) => total + (set.weight * set.reps), 0);

      return {
        date: new Date(workout.date),
        maxWeight,
        totalVolume
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.date.getTime() - b!.date.getTime())
    .slice(-7);

  const chartData = {
    labels: exerciseHistory.map(h => format(h!.date, 'MMM d')),
    datasets: [
      {
        data: exerciseHistory.map(h =>
          chartType === 'weight' ? h!.maxWeight : h!.totalVolume
        ),
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    color: (opacity = 1) => theme.colors.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <TouchableOpacity
            style={styles.chartTypeButton}
            onPress={() => setChartType(prev => prev === 'weight' ? 'volume' : 'weight')}
          >
            <Text style={styles.chartTypeText}>
              {chartType === 'weight' ? 'Weight' : 'Volume'}
            </Text>
            <ChevronDown size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {exerciseHistory.length > 0 ? (
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        ) : (
          <EmptyState
            icon={<BarChart3 size={48} color={theme.colors.border} />}
            title="No progress data"
            description="Complete workouts to track your progress"
          />
        )}

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>
            Track Progress For
          </Text>

          {exercises.map(exercise => (
            <ProgressExerciseItem
              key={exercise._id}
              _id={exercise._id}
              name={exercise.name}
              category={exercise.category}
              isSelected={selectedExercise === exercise._id}
              onPress={() => setSelectedExercise(exercise._id)}
            />
          ))}
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  chartTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chartTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginRight: 4,
  },
  chartContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  exercisesSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
});