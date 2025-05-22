import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Keyboard } from 'react-native';
import { theme } from '@/constants/theme';
import { X, Dumbbell as Barbell, Minus, Plus } from 'lucide-react-native';

type PlateCalculatorProps = {
  onClose: () => void;
};

type Plate = {
  weight: number;
  count: number;
  color: string;
};

export default function PlateCalculator({ onClose }: PlateCalculatorProps) {
  const [targetWeight, setTargetWeight] = useState('100');
  const [barWeight, setBarWeight] = useState('20'); // Default Olympic barbell weight
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  
  // Available plates (standard Olympic plates)
  const [availablePlates, setAvailablePlates] = useState<Plate[]>([
    { weight: 25, count: 6, color: '#FF4136' }, // Red
    { weight: 20, count: 6, color: '#0074D9' }, // Blue
    { weight: 15, count: 6, color: '#FFDC00' }, // Yellow
    { weight: 10, count: 6, color: '#2ECC40' }, // Green
    { weight: 5, count: 6, color: '#FFFFFF' },  // White
    { weight: 2.5, count: 6, color: '#AAAAAA' }, // Gray
    { weight: 1.25, count: 6, color: '#DDDDDD' }, // Light Gray
  ]);

  // Calculate the plates needed
  const calculatePlates = () => {
    const target = parseFloat(targetWeight) || 0;
    const bar = parseFloat(barWeight) || 0;
    let remaining = Math.max(0, target - bar) / 2; // Divide by 2 because we need plates for both sides
    
    const result: { weight: number, count: number, color: string }[] = [];
    
    // Sort plates by weight (descending)
    const sortedPlates = [...availablePlates].sort((a, b) => b.weight - a.weight);
    
    // Greedy algorithm to select plates
    sortedPlates.forEach(plate => {
      const platesNeeded = Math.min(Math.floor(remaining / plate.weight), plate.count);
      if (platesNeeded > 0) {
        result.push({
          weight: plate.weight,
          count: platesNeeded,
          color: plate.color
        });
        remaining -= platesNeeded * plate.weight;
      }
    });
    
    return result;
  };

  const plates = calculatePlates();
  
  // Calculate the total weight from the bar and selected plates
  const calculatedWeight = parseFloat(barWeight) + plates.reduce((sum, plate) => sum + (plate.weight * plate.count * 2), 0);
  
  // Calculate if we can achieve the exact target weight
  const targetReached = calculatedWeight === parseFloat(targetWeight);
  
  const updatePlateCount = (index: number, change: number) => {
    const newPlates = [...availablePlates];
    newPlates[index].count = Math.max(0, newPlates[index].count + change);
    setAvailablePlates(newPlates);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Plate Calculator</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Target Weight</Text>
            <TextInput
              style={styles.input}
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="numeric"
              selectTextOnFocus
              blurOnSubmit={true}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Bar Weight</Text>
            <TextInput
              style={styles.input}
              value={barWeight}
              onChangeText={setBarWeight}
              keyboardType="numeric"
              selectTextOnFocus
              blurOnSubmit={true}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
          
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                unit === 'kg' && styles.activeUnitButton
              ]}
              onPress={() => setUnit('kg')}
            >
              <Text
                style={[
                  styles.unitText,
                  unit === 'kg' && styles.activeUnitText
                ]}
              >
                kg
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.unitButton,
                unit === 'lb' && styles.activeUnitButton
              ]}
              onPress={() => setUnit('lb')}
            >
              <Text
                style={[
                  styles.unitText,
                  unit === 'lb' && styles.activeUnitText
                ]}
              >
                lb
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.resultContainer}>
          <Barbell size={32} color={theme.colors.textPrimary} />
          
          <Text style={styles.resultText}>
            Total: {calculatedWeight.toFixed(2)} {unit}
          </Text>
          
          {!targetReached && (
            <Text style={styles.warningText}>
              Can't make exact weight with available plates
            </Text>
          )}
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Plates Per Side</Text>
        
        {plates.length > 0 ? (
          <View style={styles.platesContainer}>
            {plates.map((plate, index) => (
              <View key={index} style={styles.plateRow}>
                <View 
                  style={[
                    styles.plateBadge,
                    { backgroundColor: plate.color }
                  ]}
                >
                  <Text style={styles.plateWeight}>{plate.weight}</Text>
                </View>
                <Text style={styles.plateText}>× {plate.count}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>
            Just use the empty bar
          </Text>
        )}
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Available Plates</Text>
        
        <ScrollView style={styles.availablePlatesContainer}>
          {availablePlates.map((plate, index) => (
            <View key={index} style={styles.availablePlateRow}>
              <View 
                style={[
                  styles.plateBadge,
                  { backgroundColor: plate.color }
                ]}
              >
                <Text style={styles.plateWeight}>{plate.weight}</Text>
              </View>
              
              <Text style={styles.availableCount}>{plate.count} pairs</Text>
              
              <View style={styles.countAdjuster}>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => updatePlateCount(index, -1)}
                >
                  <Minus size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => updatePlateCount(index, 1)}
                >
                  <Plus size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  container: {
    width: '85%',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
  },
  inputContainer: {
    flex: 1,
    marginRight: 12,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 2,
    height: 42,
    alignItems: 'center',
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeUnitButton: {
    backgroundColor: theme.colors.primary,
  },
  unitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  activeUnitText: {
    color: theme.colors.white,
  },
  resultContainer: {
    alignItems: 'center',
    padding: 16,
  },
  resultText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: theme.colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  warningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.warning,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    padding: 16,
    paddingBottom: 8,
  },
  platesContainer: {
    padding: 16,
    paddingTop: 0,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  plateBadge: {
    width: 48,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  plateWeight: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#000000',
  },
  plateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.textSecondary,
    padding: 16,
    paddingTop: 0,
  },
  availablePlatesContainer: {
    padding: 16,
    paddingTop: 0,
    maxHeight: 200,
  },
  availablePlateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  availableCount: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginLeft: 12,
  },
  countAdjuster: {
    flexDirection: 'row',
  },
  adjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});