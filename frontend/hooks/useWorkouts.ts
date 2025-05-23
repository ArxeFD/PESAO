import { useState, useEffect, useCallback } from 'react';
import { Workout } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.91:3000/api'  // Development
  : 'https://api.pesao.com/api';   // Production

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchWorkouts = useCallback(async () => {
    try {
      console.log('🔄 Starting fetchWorkouts');
      setIsLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/workouts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch workouts' }));
        throw new Error(errorData.error || 'Failed to fetch workouts');
      }

      const data = await response.json();
      console.log('📥 Fetched workouts data:', data);
      setWorkouts(data);
      console.log('💾 Updated workouts state with:', data);
    } catch (err: any) {
      console.error('❌ Error in fetchWorkouts:', err);
      setError(err.message || 'Failed to load workouts');
      setWorkouts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('👤 User changed:', user);
    if (user) {
      fetchWorkouts();
    }
  }, [user, fetchWorkouts]);

  const getWorkoutById = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making request to:', `${API_BASE_URL}/workouts/${id}`);
      console.log('With token:', token);

      const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch workout' }));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch workout');
      }

      const workout = await response.json();
      return workout;
    } catch (err: any) {
      console.error('Error fetching workout:', err);
      throw new Error(err.message || 'Failed to fetch workout');
    }
  };

  const createWorkout = async (workoutData: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🔄 Starting createWorkout');
      console.log('📤 Create data:', workoutData);
      
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workoutData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create workout' }));
        throw new Error(errorData.error || 'Failed to create workout');
      }

      const newWorkout = await response.json();
      console.log('📥 Received new workout:', newWorkout);
      
      // Update local state immediately
      setWorkouts(prevWorkouts => {
        console.log('📦 Previous workouts state:', prevWorkouts);
        const newWorkouts = [newWorkout, ...prevWorkouts];
        console.log('📦 New workouts state:', newWorkouts);
        return newWorkouts;
      });
      
      return newWorkout;
    } catch (err: any) {
      console.error('❌ Error in createWorkout:', err);
      throw new Error(err.message || 'Failed to create workout');
    }
  };

  const updateWorkout = async (id: string, workoutData: Partial<Workout>) => {
    try {
      console.log('🔄 Starting updateWorkout for ID:', id);
      console.log('📤 Update data:', workoutData);
      
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workoutData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update workout' }));
        console.error('❌ Error response:', errorData);
        throw new Error(errorData.error || 'Failed to update workout');
      }

      const updatedWorkout = await response.json();
      console.log('📥 Received updated workout from server:', updatedWorkout);
      
      // Update local state immediately with a new array reference
      setWorkouts(prevWorkouts => {
        console.log('📦 Previous workouts state:', prevWorkouts);
        const newWorkouts = prevWorkouts.map(workout => {
          if (workout._id === id) {
            console.log('🔄 Updating workout:', workout._id);
            console.log('📦 Old workout data:', workout);
            console.log('📦 New workout data:', updatedWorkout);
            return updatedWorkout; // Use the complete updated workout from server
          }
          return workout;
        });
        console.log('📦 New workouts state:', newWorkouts);
        return newWorkouts;
      });

      return updatedWorkout;
    } catch (err) {
      console.error('❌ Error in updateWorkout:', err);
      throw err;
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      console.log('🔄 Starting deleteWorkout for ID:', id);
      
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }

      // Update local state immediately
      setWorkouts(prevWorkouts => {
        console.log('📦 Previous workouts state:', prevWorkouts);
        const newWorkouts = prevWorkouts.filter(workout => workout._id !== id);
        console.log('📦 New workouts state:', newWorkouts);
        return newWorkouts;
      });
    } catch (err) {
      console.error('❌ Error in deleteWorkout:', err);
      throw err;
    }
  };

  const sortWorkouts = (option: 'most_recent' | 'oldest' | 'most_volume' | 'most_sets') => {
    const sorted = [...workouts];
    
    switch (option) {
      case 'most_recent':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'most_volume':
        return sorted.sort((a, b) => {
          const volumeA = a.exercises.reduce((total, ex) => 
            total + ex.sets.reduce((setTotal, set) => setTotal + (set.weight * set.reps), 0), 0);
          const volumeB = b.exercises.reduce((total, ex) => 
            total + ex.sets.reduce((setTotal, set) => setTotal + (set.weight * set.reps), 0), 0);
          return volumeB - volumeA;
        });
      case 'most_sets':
        return sorted.sort((a, b) => {
          const setsA = a.exercises.reduce((total, ex) => total + ex.sets.length, 0);
          const setsB = b.exercises.reduce((total, ex) => total + ex.sets.length, 0);
          return setsB - setsA;
        });
      default:
        return sorted;
    }
  };

  return {
    workouts,
    isLoading,
    error,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    sortWorkouts,
    refetch: fetchWorkouts
  };
}