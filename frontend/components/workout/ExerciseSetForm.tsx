import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { ExerciseSet } from '@/types';
import { Plus, X } from 'lucide-react-native';

interface ExerciseSetFormProps {
  sets: ExerciseSet[];
  onUpdate: (sets: ExerciseSet[]) => void;
}

export function ExerciseSetForm({ sets, onUpdate }: ExerciseSetFormProps) {
  console.log('ExerciseSetForm rendered with sets:', sets);

  const handleAddSet = () => {
    console.log('Adding new set');
    const newSet: ExerciseSet = {
      _id: Date.now().toString(),
      weight: 0,
      reps: 0,
      completed: false
    };
    console.log('New set to add:', newSet);
    onUpdate([...sets, newSet]);
  };

  const handleRemoveSet = (index: number) => {
    console.log('Removing set at index:', index);
    const newSets = sets.filter((_, i) => i !== index);
    console.log('Updated sets after removal:', newSets);
    onUpdate(newSets);
  };

  const handleUpdateSet = (index: number, field: 'weight' | 'reps', value: string) => {
    console.log('Updating set at index:', index, 'field:', field, 'value:', value);
    const newSets = sets.map((set, i) => {
      if (i === index) {
        const updatedSet = {
          ...set,
          [field]: field === 'weight' ? parseFloat(value) || 0 : parseInt(value) || 0
        };
        console.log('Updated set:', updatedSet);
        return updatedSet;
      }
      return set;
    });
    console.log('All sets after update:', newSets);
    onUpdate(newSets);
  };

  return (
    <View style={styles.container}>
      <View style={styles.setHeaders}>
        <Text style={styles.setHeaderText}>SET</Text>
        <Text style={styles.setHeaderText}>KG</Text>
        <Text style={styles.setHeaderText}>REPS</Text>
        <Text style={styles.setHeaderText}></Text>
      </View>

      {sets.map((set, index) => (
        <View key={set._id} style={styles.setRow}>
          <Text style={styles.setText}>{index + 1}</Text>
          <TextInput
            style={styles.setInput}
            value={set.weight.toString()}
            onChangeText={(value) => handleUpdateSet(index, 'weight', value)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TextInput
            style={styles.setInput}
            value={set.reps.toString()}
            onChangeText={(value) => handleUpdateSet(index, 'reps', value)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.colors.textSecondary}
          />
          {sets.length > 1 && (
            <TouchableOpacity
              onPress={() => handleRemoveSet(index)}
              style={styles.removeSetButton}
            >
              <X size={14} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity 
        style={styles.addSetButton}
        onPress={handleAddSet}
      >
        <Plus size={14} color={theme.colors.primary} />
        <Text style={styles.addSetText}>Add Set</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  setHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  setHeaderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
    width: 50,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    width: 50,
    textAlign: 'center',
  },
  setInput: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    width: 50,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  removeSetButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignSelf: 'flex-start',
  },
  addSetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: theme.colors.primary,
    marginLeft: 6,
  },
}); 