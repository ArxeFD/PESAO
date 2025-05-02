# PESAO Backend API

A Next.js API for managing workouts and exercise routines.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

3. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
- **POST** `/api/auth/login`
- Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Workouts

#### List Workouts
- **GET** `/api/workouts`
- Query Parameters:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `startDate`: Filter by start date (ISO string)
  - `endDate`: Filter by end date (ISO string)
- Headers:
  - `Authorization: Bearer <token>`

#### Create Workout
- **POST** `/api/workouts`
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "name": "Monday Workout",
  "description": "Full body workout",
  "exercises": [
    {
      "name": "Bench Press",
      "sets": 3,
      "reps": 10,
      "weight": 60,
      "notes": "Keep proper form"
    }
  ],
  "duration": 60,
  "date": "2024-02-20T10:00:00Z"
}
```

#### Get Workout
- **GET** `/api/workouts/{id}`
- Headers:
  - `Authorization: Bearer <token>`

#### Update Workout
- **PUT** `/api/workouts/{id}`
- Headers:
  - `Authorization: Bearer <token>`
- Body: Same as create workout (all fields optional)

#### Delete Workout
- **DELETE** `/api/workouts/{id}`
- Headers:
  - `Authorization: Bearer <token>`

### Routines

#### List Routines
- **GET** `/api/routines`
- Query Parameters:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `isActive`: Filter by active status (boolean)
- Headers:
  - `Authorization: Bearer <token>`

#### Create Routine
- **POST** `/api/routines`
- Headers:
  - `Authorization: Bearer <token>`
- Body:
```json
{
  "name": "Weekly Routine",
  "description": "Full body split",
  "exercises": [
    {
      "name": "Squats",
      "sets": 4,
      "reps": 8,
      "weight": 80,
      "notes": "Focus on depth"
    }
  ],
  "frequency": ["Monday", "Wednesday", "Friday"]
}
```

#### Get Routine
- **GET** `/api/routines/{id}`
- Headers:
  - `Authorization: Bearer <token>`

#### Update Routine
- **PUT** `/api/routines/{id}`
- Headers:
  - `Authorization: Bearer <token>`
- Body: Same as create routine (all fields optional)

#### Delete Routine
- **DELETE** `/api/routines/{id}`
- Headers:
  - `Authorization: Bearer <token>`

## Models

### User
- email (string, required, unique)
- password (string, required)
- name (string, required)
- role (string, enum: ['user', 'admin'])
- createdAt (date)
- updatedAt (date)

### Workout
- userId (ObjectId, required)
- name (string, required)
- description (string)
- exercises (array of Exercise)
- duration (number, required)
- date (date, required)
- createdAt (date)
- updatedAt (date)

### Routine
- userId (ObjectId, required)
- name (string, required)
- description (string)
- exercises (array of Exercise)
- frequency (array of string, enum: days of week)
- isActive (boolean)
- createdAt (date)
- updatedAt (date)

### Exercise (Embedded Schema)
- name (string, required)
- sets (number, required)
- reps (number, required)
- weight (number, required)
- notes (string)

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message",
  "details": [] // Optional validation error details
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error 