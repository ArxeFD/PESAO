import { Exercise } from '@/types';

export const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Bench Press',
    category: 'chest',
    primaryMuscles: ['chest', 'frontDelts', 'triceps'],
    secondaryMuscles: ['upperChest', 'lowerChest'],
    instructions: 'Lie on a flat bench, grip the bar slightly wider than shoulder-width, lower the bar to mid-chest, and press back up to starting position.',
    equipment: 'barbell'
  },
  {
    id: '2',
    name: 'Pull Up',
    category: 'back',
    primaryMuscles: ['lats', 'upperBack'],
    secondaryMuscles: ['biceps', 'forearms'],
    instructions: 'Grip the bar with hands slightly wider than shoulder-width, pull your body up until your chin clears the bar, and slowly lower back down.',
    equipment: 'bodyweight'
  },
  {
    id: '3',
    name: 'Shoulder Press',
    category: 'shoulders',
    primaryMuscles: ['frontDelts', 'sideDelts'],
    secondaryMuscles: ['triceps', 'traps'],
    instructions: 'Sit on a bench with back support, hold dumbbells at shoulder height, and press them upward until arms are extended overhead.',
    equipment: 'dumbbell'
  },
  {
    id: '4',
    name: 'Squat',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'lowerBack'],
    instructions: 'Stand with feet shoulder-width apart, barbell on upper back, lower your body by bending knees and hips until thighs are parallel to the floor, then return to starting position.',
    equipment: 'barbell'
  },
  {
    id: '5',
    name: 'Tricep Pushdown',
    category: 'arms',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    instructions: 'Stand facing a cable machine with a rope attachment at head height, grip the rope and push down until arms are fully extended.',
    equipment: 'cable'
  },
  {
    id: '6',
    name: 'Lat Pulldown',
    category: 'back',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'rearDelts'],
    instructions: 'Sit at a lat pulldown machine, grip the bar wider than shoulder-width, and pull the bar down to your upper chest while keeping your back slightly arched.',
    equipment: 'cable'
  },
  {
    id: '7',
    name: 'Bicep Curl',
    category: 'arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    instructions: 'Stand with dumbbells in hand, palms facing forward, and curl the weights up to shoulder level while keeping elbows close to your sides.',
    equipment: 'dumbbell'
  },
  {
    id: '8',
    name: 'Romanian Deadlift',
    category: 'legs',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['lowerBack'],
    instructions: 'Stand with feet hip-width apart, hold a barbell in front of thighs, bend at the hips while keeping back straight, and lower the bar along your legs until you feel a stretch in hamstrings.',
    equipment: 'barbell'
  },
  {
    id: '9',
    name: 'Leg Press',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    instructions: 'Sit on a leg press machine with back against pad, place feet on platform shoulder-width apart, and push the platform away by extending your knees.',
    equipment: 'machine'
  },
  {
    id: '10',
    name: 'Incline Bench Press',
    category: 'chest',
    primaryMuscles: ['upperChest', 'frontDelts'],
    secondaryMuscles: ['triceps'],
    instructions: 'Lie on an incline bench set to 30-45 degrees, grip the bar slightly wider than shoulder-width, lower the bar to upper chest, and press back up to starting position.',
    equipment: 'barbell'
  }
];