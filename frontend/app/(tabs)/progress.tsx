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

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const { workouts } = useWorkouts();
  const { exercises } = useExercises();
  const [selectedExercise, setSelectedExercise] = useState(
    exercises.length > 0 ? exercises[0].id : ''
  );
  const [chartType, setChartType] = useState<'weight' | 'volume'>('weight');

  // Get selected exercise data
  const selectedExerciseData = exercises.find(ex => ex.id === selectedExercise);
  
  // Get workout history for the selected exercise
  const exerciseHistory = workouts
    .filter(workout => 
      workout.exercises.some(ex => ex.exerciseId === selectedExercise)
    )
    .map(workout => {
      const exerciseData = workout.exercises.find(ex => ex.exerciseId === selectedExercise);
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
    .slice(-7); // Get last 7 workouts

  // Prepare chart data
  const chartData = {
    labels: exerciseHistory.map(history => 
      history!.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        data: chartType === 'weight' 
          ? exerciseHistory.map(history => history!.maxWeight)
          : exerciseHistory.map(history => history!.totalVolume),
        color: () => theme.colors.primary,
        strokeWidth: 2
      }
    ],
    legend: [chartType === 'weight' ? 'Max Weight (kg)' : 'Total Volume (kg)']
  };

  const hasData = exerciseHistory.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress</Text>
        </View>

        <View style={styles.exerciseSelector}>
          <TouchableOpacity style={styles.selectorButton}>
            {selectedExerciseData && (
              <>
                <Text style={styles.selectedExerciseName}>
                  {selectedExerciseData.name}
                </Text>
                <ChevronDown size={20} color={theme.colors.textPrimary} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {hasData ? (
          <>
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>
                  {chartType === 'weight' ? 'Max Weight Progress' : 'Volume Progress'}
                </Text>
                <View style={styles.chartTypeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.chartTypeButton,
                      chartType === 'weight' && styles.activeChartTypeButton
                    ]}
                    onPress={() => setChartType('weight')}
                  >
                    <Text
                      style={[
                        styles.chartTypeText,
                        chartType === 'weight' && styles.activeChartTypeText
                      ]}
                    >
                      Weight
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.chartTypeButton,
                      chartType === 'volume' && styles.activeChartTypeButton
                    ]}
                    onPress={() => setChartType('volume')}
                  >
                    <Text
                      style={[
                        styles.chartTypeText,
                        chartType === 'volume' && styles.activeChartTypeText
                      ]}
                    >
                      Volume
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <LineChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                  backgroundColor: theme.colors.card,
                  backgroundGradientFrom: theme.colors.card,
                  backgroundGradientTo: theme.colors.card,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  labelColor: () => theme.colors.textSecondary,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: theme.colors.primary,
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {exerciseHistory[exerciseHistory.length - 1]!.maxWeight} kg
                </Text>
                <Text style={styles.statLabel}>Current Max</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {exerciseHistory[0]!.maxWeight} kg
                </Text>
                <Text style={styles.statLabel}>Starting Max</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={[
                  styles.statValue, 
                  { color: theme.colors.success }
                ]}>
                  +{(exerciseHistory[exerciseHistory.length - 1]!.maxWeight - exerciseHistory[0]!.maxWeight).toFixed(1)} kg
                </Text>
                <Text style={styles.statLabel}>Increase</Text>
              </View>
            </View>
          </>
        ) : (
          <EmptyState
            icon={<BarChart3 size={48} color={theme.colors.border} />}
            title="No progress data"
            description="Complete workouts to track your progress"
            actionLabel="Start a Workout"
            onAction={() => {}}
          />
        )}

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>
            Track Progress For
          </Text>
          
          {exercises.map(exercise => (
            <ProgressExerciseItem
              key={exercise.id}
              name={exercise.name}
              category={exercise.category}
              isSelected={selectedExercise === exercise.id}
              onPress={() => setSelectedExercise(exercise.id)}
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
  scrollView: {
    flex: 1,
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
  exerciseSelector: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
  },
  selectedExerciseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginRight: 8,
  },
  chartContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  chartTypeSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 2,
  },
  chartTypeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeChartTypeButton: {
    backgroundColor: theme.colors.primary,
  },
  chartTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  activeChartTypeText: {
    color: theme.colors.white,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  exercisesSection: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
});