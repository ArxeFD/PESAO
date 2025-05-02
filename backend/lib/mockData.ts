import { IUser, IWorkout, IRoutine } from '@/models/User';

// Mock users
export const mockUsers: IUser[] = [
  {
    _id: '1',
    email: 'user1@example.com',
    password: 'hashed_password_1',
    name: 'John Doe',
    role: 'user',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    comparePassword: async () => true,
  },
  {
    _id: '2',
    email: 'user2@example.com',
    password: 'hashed_password_2',
    name: 'Jane Smith',
    role: 'user',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    comparePassword: async () => true,
  },
];

// Mock workouts
export const mockWorkouts: IWorkout[] = [
  {
    _id: '1',
    userId: '1',
    name: 'Chest Day',
    description: 'Focus on chest and triceps',
    exercises: [
      {
        name: 'Bench Press',
        sets: 4,
        reps: 8,
        weight: 60,
        notes: 'Keep proper form',
      },
      {
        name: 'Incline Dumbbell Press',
        sets: 3,
        reps: 10,
        weight: 20,
        notes: 'Focus on chest contraction',
      },
    ],
    duration: 60,
    date: new Date('2024-02-20'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    _id: '2',
    userId: '1',
    name: 'Leg Day',
    description: 'Focus on legs and core',
    exercises: [
      {
        name: 'Squats',
        sets: 4,
        reps: 8,
        weight: 80,
        notes: 'Keep back straight',
      },
      {
        name: 'Romanian Deadlifts',
        sets: 3,
        reps: 10,
        weight: 60,
        notes: 'Focus on hamstrings',
      },
    ],
    duration: 75,
    date: new Date('2024-02-21'),
    createdAt: new Date('2024-02-21'),
    updatedAt: new Date('2024-02-21'),
  },
];

// Mock routines
export const mockRoutines: IRoutine[] = [
  {
    _id: '1',
    userId: '1',
    name: 'Push Pull Legs',
    description: 'Standard PPL routine',
    exercises: [
      {
        name: 'Bench Press',
        sets: 4,
        reps: 8,
        weight: 60,
        notes: 'Keep proper form',
      },
      {
        name: 'Overhead Press',
        sets: 3,
        reps: 10,
        weight: 30,
        notes: 'Focus on shoulders',
      },
    ],
    frequency: ['Monday', 'Wednesday', 'Friday'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: '2',
    userId: '1',
    name: 'Upper Lower Split',
    description: 'Alternating upper and lower body',
    exercises: [
      {
        name: 'Squats',
        sets: 4,
        reps: 8,
        weight: 80,
        notes: 'Keep back straight',
      },
      {
        name: 'Romanian Deadlifts',
        sets: 3,
        reps: 10,
        weight: 60,
        notes: 'Focus on hamstrings',
      },
    ],
    frequency: ['Tuesday', 'Thursday', 'Saturday'],
    isActive: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

// Mock database service
export class MockDB {
  private static instance: MockDB;
  private users: IUser[];
  private workouts: IWorkout[];
  private routines: IRoutine[];

  private constructor() {
    this.users = [...mockUsers];
    this.workouts = [...mockWorkouts];
    this.routines = [...mockRoutines];
  }

  public static getInstance(): MockDB {
    if (!MockDB.instance) {
      MockDB.instance = new MockDB();
    }
    return MockDB.instance;
  }

  // User methods
  async findUserByEmail(email: string): Promise<IUser | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findUserById(id: string): Promise<IUser | null> {
    return this.users.find(user => user._id === id) || null;
  }

  async createUser(user: Omit<IUser, '_id'>): Promise<IUser> {
    const newUser = {
      ...user,
      _id: (this.users.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Workout methods
  async findWorkoutsByUserId(userId: string, options: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<{ workouts: IWorkout[]; total: number }> {
    let filteredWorkouts = this.workouts.filter(w => w.userId === userId);

    if (options.startDate && options.endDate) {
      filteredWorkouts = filteredWorkouts.filter(w => 
        w.date >= options.startDate! && w.date <= options.endDate!
      );
    }

    const total = filteredWorkouts.length;
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const paginatedWorkouts = filteredWorkouts
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(skip, skip + limit);

    return { workouts: paginatedWorkouts, total };
  }

  async findWorkoutById(id: string, userId: string): Promise<IWorkout | null> {
    return this.workouts.find(w => w._id === id && w.userId === userId) || null;
  }

  async createWorkout(workout: Omit<IWorkout, '_id'>): Promise<IWorkout> {
    const newWorkout = {
      ...workout,
      _id: (this.workouts.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  async updateWorkout(id: string, userId: string, update: Partial<IWorkout>): Promise<IWorkout | null> {
    const index = this.workouts.findIndex(w => w._id === id && w.userId === userId);
    if (index === -1) return null;

    this.workouts[index] = {
      ...this.workouts[index],
      ...update,
      updatedAt: new Date(),
    };

    return this.workouts[index];
  }

  async deleteWorkout(id: string, userId: string): Promise<boolean> {
    const index = this.workouts.findIndex(w => w._id === id && w.userId === userId);
    if (index === -1) return false;

    this.workouts.splice(index, 1);
    return true;
  }

  // Routine methods
  async findRoutinesByUserId(userId: string, options: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  } = {}): Promise<{ routines: IRoutine[]; total: number }> {
    let filteredRoutines = this.routines.filter(r => r.userId === userId);

    if (options.isActive !== undefined) {
      filteredRoutines = filteredRoutines.filter(r => r.isActive === options.isActive);
    }

    const total = filteredRoutines.length;
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const paginatedRoutines = filteredRoutines
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(skip, skip + limit);

    return { routines: paginatedRoutines, total };
  }

  async findRoutineById(id: string, userId: string): Promise<IRoutine | null> {
    return this.routines.find(r => r._id === id && r.userId === userId) || null;
  }

  async createRoutine(routine: Omit<IRoutine, '_id'>): Promise<IRoutine> {
    const newRoutine = {
      ...routine,
      _id: (this.routines.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.routines.push(newRoutine);
    return newRoutine;
  }

  async updateRoutine(id: string, userId: string, update: Partial<IRoutine>): Promise<IRoutine | null> {
    const index = this.routines.findIndex(r => r._id === id && r.userId === userId);
    if (index === -1) return null;

    this.routines[index] = {
      ...this.routines[index],
      ...update,
      updatedAt: new Date(),
    };

    return this.routines[index];
  }

  async deleteRoutine(id: string, userId: string): Promise<boolean> {
    const index = this.routines.findIndex(r => r._id === id && r.userId === userId);
    if (index === -1) return false;

    this.routines.splice(index, 1);
    return true;
  }
} 