require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const connectDB = require('../lib/db').default;
const Exercise = require('../models/Exercise').default;

const exercises = [
  {
    name: 'Bench Press',
    category: 'chest',
    primaryMuscles: ['chest', 'frontDelts', 'triceps'],
    secondaryMuscles: ['upperChest', 'lowerChest'],
    instructions: 'Lie on a flat bench, grip the bar slightly wider than shoulder-width, lower the bar to mid-chest, and press back up to starting position.',
    equipment: 'barbell'
  },
  {
    name: 'Pull Up',
    category: 'back',
    primaryMuscles: ['lats', 'upperBack'],
    secondaryMuscles: ['biceps', 'forearms'],
    instructions: 'Grip the bar with hands slightly wider than shoulder-width, pull your body up until your chin clears the bar, and slowly lower back down.',
    equipment: 'bodyweight'
  },
  {
    name: 'Shoulder Press',
    category: 'shoulders',
    primaryMuscles: ['frontDelts', 'sideDelts'],
    secondaryMuscles: ['triceps', 'traps'],
    instructions: 'Sit on a bench with back support, hold dumbbells at shoulder height, and press them upward until arms are extended overhead.',
    equipment: 'dumbbell'
  },
  {
    name: 'Squat',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'lowerBack'],
    instructions: 'Stand with feet shoulder-width apart, barbell on upper back, lower your body by bending knees and hips until thighs are parallel to the floor, then return to starting position.',
    equipment: 'barbell'
  },
  {
    name: 'Tricep Pushdown',
    category: 'arms',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    instructions: 'Stand facing a cable machine with a rope attachment at head height, grip the rope and push down until arms are fully extended.',
    equipment: 'cable'
  },
  {
    name: 'Lat Pulldown',
    category: 'back',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'rearDelts'],
    instructions: 'Sit at a lat pulldown machine, grip the bar wider than shoulder-width, and pull the bar down to your upper chest while keeping your back slightly arched.',
    equipment: 'cable'
  },
  {
    name: 'Bicep Curl',
    category: 'arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    instructions: 'Stand with dumbbells in hand, palms facing forward, and curl the weights up to shoulder level while keeping elbows close to your sides.',
    equipment: 'dumbbell'
  },
  {
    name: 'Romanian Deadlift',
    category: 'legs',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['lowerBack'],
    instructions: 'Stand with feet hip-width apart, hold a barbell in front of thighs, bend at the hips while keeping back straight, and lower the bar along your legs until you feel a stretch in hamstrings.',
    equipment: 'barbell'
  },
  {
    name: 'Leg Press',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    instructions: 'Sit on a leg press machine with back against pad, place feet on platform shoulder-width apart, and push the platform away by extending your knees.',
    equipment: 'machine'
  },
  {
    name: 'Incline Bench Press',
    category: 'chest',
    primaryMuscles: ['upperChest', 'frontDelts'],
    secondaryMuscles: ['triceps'],
    instructions: 'Lie on an incline bench set to 30-45 degrees, grip the bar slightly wider than shoulder-width, lower the bar to upper chest, and press back up to starting position.',
    equipment: 'barbell'
  }
];

async function seedExercises() {
  try {
    await connectDB();
    
    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('Cleared existing exercises');
    
    // Insert new exercises
    const result = await Exercise.insertMany(exercises);
    console.log(`Successfully seeded ${result.length} exercises`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding exercises:', error);
    process.exit(1);
  }
}

seedExercises(); 