import { Workout } from '@/types';

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Push Day',
    date: new Date('2023-09-01T09:30:00').toISOString(),
    duration: 65,
    notes: 'Felt strong today.',
    exercises: [
      {
        exerciseId: '1',
        sets: [
          { id: '1-1', weight: 100, reps: 8, completed: true },
          { id: '1-2', weight: 100, reps: 8, completed: true },
          { id: '1-3', weight: 100, reps: 7, completed: true },
          { id: '1-4', weight: 90, reps: 8, completed: true }
        ],
        notes: 'Chest felt tight on the last set.'
      },
      {
        exerciseId: '3',
        sets: [
          { id: '3-1', weight: 70, reps: 10, completed: true },
          { id: '3-2', weight: 70, reps: 10, completed: true },
          { id: '3-3', weight: 70, reps: 9, completed: true }
        ],
        notes: ''
      },
      {
        exerciseId: '5',
        sets: [
          { id: '5-1', weight: 30, reps: 12, completed: true },
          { id: '5-2', weight: 30, reps: 12, completed: true },
          { id: '5-3', weight: 30, reps: 10, completed: true }
        ],
        notes: 'Increased weight from last session.'
      }
    ]
  },
  {
    id: '2',
    name: 'Pull Day',
    date: new Date('2023-09-03T10:15:00').toISOString(),
    duration: 70,
    notes: 'Good pump in the biceps.',
    exercises: [
      {
        exerciseId: '2',
        sets: [
          { id: '2-1', weight: 12, reps: 10, completed: true },
          { id: '2-2', weight: 12, reps: 10, completed: true },
          { id: '2-3', weight: 12, reps: 8, completed: true }
        ],
        notes: 'Used straps on the last set.'
      },
      {
        exerciseId: '6',
        sets: [
          { id: '6-1', weight: 80, reps: 10, completed: true },
          { id: '6-2', weight: 80, reps: 10, completed: true },
          { id: '6-3', weight: 70, reps: 12, completed: true }
        ],
        notes: ''
      },
      {
        exerciseId: '7',
        sets: [
          { id: '7-1', weight: 20, reps: 12, completed: true },
          { id: '7-2', weight: 20, reps: 12, completed: true },
          { id: '7-3', weight: 20, reps: 10, completed: true }
        ],
        notes: 'Need to work on form.'
      }
    ]
  },
  {
    id: '3',
    name: 'Leg Day',
    date: new Date('2023-09-05T08:45:00').toISOString(),
    duration: 75,
    notes: 'Tough session but felt great afterwards.',
    exercises: [
      {
        exerciseId: '4',
        sets: [
          { id: '4-1', weight: 140, reps: 8, completed: true },
          { id: '4-2', weight: 140, reps: 8, completed: true },
          { id: '4-3', weight: 140, reps: 6, completed: true },
          { id: '4-4', weight: 120, reps: 8, completed: true }
        ],
        notes: 'Depth was good on all sets.'
      },
      {
        exerciseId: '8',
        sets: [
          { id: '8-1', weight: 100, reps: 12, completed: true },
          { id: '8-2', weight: 100, reps: 12, completed: true },
          { id: '8-3', weight: 100, reps: 10, completed: true }
        ],
        notes: ''
      },
      {
        exerciseId: '9',
        sets: [
          { id: '9-1', weight: 70, reps: 15, completed: true },
          { id: '9-2', weight: 70, reps: 15, completed: true },
          { id: '9-3', weight: 70, reps: 12, completed: true }
        ],
        notes: 'Calves were cramping a bit.'
      }
    ]
  },
  {
    id: '4',
    name: 'Upper Body',
    date: new Date('2023-09-07T17:30:00').toISOString(),
    duration: 65,
    notes: 'Quick session after work.',
    exercises: [
      {
        exerciseId: '1',
        sets: [
          { id: '1-1', weight: 95, reps: 10, completed: true },
          { id: '1-2', weight: 95, reps: 8, completed: true },
          { id: '1-3', weight: 90, reps: 9, completed: true }
        ],
        notes: 'Focused on slower negatives.'
      },
      {
        exerciseId: '2',
        sets: [
          { id: '2-1', weight: 10, reps: 12, completed: true },
          { id: '2-2', weight: 10, reps: 12, completed: true },
          { id: '2-3', weight: 10, reps: 10, completed: true }
        ],
        notes: ''
      },
      {
        exerciseId: '7',
        sets: [
          { id: '7-1', weight: 22.5, reps: 10, completed: true },
          { id: '7-2', weight: 22.5, reps: 10, completed: true },
          { id: '7-3', weight: 20, reps: 12, completed: true }
        ],
        notes: 'Worked on keeping elbows in.'
      }
    ]
  },
  {
    id: '5',
    name: 'Lower Body',
    date: new Date('2023-09-09T09:00:00').toISOString(),
    duration: 60,
    notes: 'Reduced weight due to slight knee discomfort.',
    exercises: [
      {
        exerciseId: '4',
        sets: [
          { id: '4-1', weight: 120, reps: 10, completed: true },
          { id: '4-2', weight: 120, reps: 10, completed: true },
          { id: '4-3', weight: 120, reps: 8, completed: true }
        ],
        notes: 'Kept it light but with good form.'
      },
      {
        exerciseId: '9',
        sets: [
          { id: '9-1', weight: 75, reps: 12, completed: true },
          { id: '9-2', weight: 75, reps: 12, completed: true },
          { id: '9-3', weight: 75, reps: 10, completed: true }
        ],
        notes: ''
      }
    ]
  }
];