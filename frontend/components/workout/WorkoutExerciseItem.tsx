import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { Exercise, ExerciseSet } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

type WorkoutExerciseItemProps = {
  exercise: Exercise;
  sets: ExerciseSet[];
};

export default function WorkoutExerciseItem({ exercise, sets }: WorkoutExerciseItemProps) {
  const [expanded, setExpanded] = useState(false);

  // Calculate best set (by weight * reps)
  const bestSet = [...sets].sort((a, b) => (b.weight * b.reps) - (a.weight * a.reps))[0];
  
  // Calculate total volume
  const totalVolume = sets.reduce((acc, set) => acc + (set.weight * set.reps), 0);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseCategory}>{exercise.category}</Text>
        </View>
        
        <View style={styles.headerRight}>
          <Text style={styles.setCount}>{sets.length} sets</Text>
          {expanded ? (
            <ChevronUp size={20} color={theme.colors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          <View style={styles.setsHeader}>
            <Text style={styles.setsHeaderText}>SET</Text>
            <Text style={styles.setsHeaderText}>KG</Text>
            <Text style={styles.setsHeaderText}>REPS</Text>
            <Text style={styles.setsHeaderText}>VOL</Text>
          </View>
          
          {sets.map((set, index) => (
            <View key={set.id} style={styles.setRow}>
              <Text style={styles.setText}>{index + 1}</Text>
              <Text style={styles.setText}>{set.weight}</Text>
              <Text style={styles.setText}>{set.reps}</Text>
              <Text style={styles.setText}>{(set.weight * set.reps).toFixed(0)}</Text>
            </View>
          ))}
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Best Set</Text>
              <Text style={styles.summaryValue}>
                {bestSet.weight} kg × {bestSet.reps}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Volume</Text>
              <Text style={styles.summaryValue}>
                {totalVolume.toLocaleString()} kg
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  exerciseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  exerciseCategory: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  content: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  setsHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  setsHeaderText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  setText: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
});