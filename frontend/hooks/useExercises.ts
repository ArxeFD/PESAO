import { useState, useEffect } from 'react';
import { Exercise, Muscle, Equipment } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
  ? 'http://192.168.1.77:3000/api'  // Development
  : 'https://api.pesao.com/api';   // Production

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/exercises`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch exercises' }));
        throw new Error(errorData.error || 'Failed to fetch exercises');
      }

      const data = await response.json();
      setExercises(data);
    } catch (err: any) {
      console.error('Error fetching exercises:', err);
      setError(err.message || 'Failed to load exercises');
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExercises();
    }
  }, [user]);

  const getExerciseById = (id: string) => {
    const exercise = exercises.find(exercise => exercise._id === id);
    return exercise;
  };

  const getExercisesByCategory = (category: string) => {
    return exercises.filter(exercise => exercise.category === category);
  };

  const getExercisesByMuscle = (muscle: Muscle) => {
    return exercises.filter(exercise =>
      exercise.primaryMuscles.includes(muscle) ||
      exercise.secondaryMuscles.includes(muscle)
    );
  };

  const getExercisesByEquipment = (equipment: Equipment) => {
    return exercises.filter(exercise => exercise.equipment === equipment);
  };

  return {
    exercises,
    isLoading,
    error,
    getExerciseById,
    getExercisesByCategory,
    getExercisesByMuscle,
    getExercisesByEquipment,
    refetch: fetchExercises
  };
}