import { useState, useEffect } from 'react';
import { Exercise } from '@/types';
import { mockExercises } from '@/data/mockExercises';

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getExerciseById = (exerciseId: string) => {
    return exercises.find(ex => ex.id === exerciseId);
  };

  const searchExercises = (query: string) => {
    if (!query) return exercises;
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(query.toLowerCase()) ||
      ex.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getExercisesByCategory = (category: string) => {
    return exercises.filter(ex => ex.category === category);
  };

  return {
    exercises,
    loading,
    error,
    getExerciseById,
    searchExercises,
    getExercisesByCategory
  };
}