import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';

type RecentExerciseCardProps = {
  name: string;
  category: string;
  lastWeight: string;
  icon: React.ReactNode;
  iconLabel: string;
  onPress: () => void;
};

export default function RecentExerciseCard({
  name,
  category,
  lastWeight,
  icon,
  iconLabel,
  onPress
}: RecentExerciseCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      
      <Text style={styles.weight}>{lastWeight}</Text>
      
      <View style={styles.progressContainer}>
        {icon}
        <Text style={styles.progressText}>{iconLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  weight: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
});