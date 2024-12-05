export const exercises = {
  beginner: {
    arms: [
      { name: "Wall Push-ups", reps: 8, sets: 2 },
      { name: "Standing Bicep Curls with Resistance Band", reps: 12, sets: 2 },
      { name: "Tricep Dips on Chair", reps: 8, sets: 2 },
    ],
    legs: [
      { name: "Bodyweight Squats", reps: 10, sets: 2 },
      { name: "Standing Calf Raises", reps: 15, sets: 2 },
      { name: "Assisted Lunges", reps: 8, sets: 2, perSide: true },
    ],
    back: [
      { name: "Superman Hold", duration: "20 seconds", sets: 2 },
      { name: "Band Pull-Aparts", reps: 12, sets: 2 },
      { name: "Bird Dogs", reps: 8, sets: 2, perSide: true },
    ],
    chest: [
      { name: "Wall Push-ups", reps: 10, sets: 2 },
      { name: "Standing Chest Press with Band", reps: 12, sets: 2 },
    ],
    core: [
      { name: "Modified Plank", duration: "20 seconds", sets: 2 },
      { name: "Knee Raises", reps: 10, sets: 2 },
      { name: "Modified Crunches", reps: 12, sets: 2 },
    ],
    shoulders: [
      { name: "Wall Angels", reps: 10, sets: 2 },
      { name: "Arm Circles", duration: "30 seconds" },
      { name: "Band Front Raises", reps: 10, sets: 2 },
    ],
    cardio: [
      { name: "Walking in Place", duration: "2 minutes" },
      { name: "Modified Jumping Jacks", duration: "30 seconds" },
      { name: "Step-Ups", duration: "1 minute" },
    ],
  },
  intermediate: {
    arms: [
      { name: "Regular Push-ups", reps: 10, sets: 3 },
      { name: "Diamond Push-ups", reps: 8, sets: 3 },
      { name: "Tricep Dips", reps: 12, sets: 3 },
    ],
    legs: [
      { name: "Jump Squats", reps: 15, sets: 3 },
      { name: "Walking Lunges", reps: 12, sets: 3, perSide: true },
      { name: "Single-Leg Calf Raises", reps: 15, sets: 3, perSide: true },
    ],
    // ... add more exercises for other body parts and fitness levels
  },
  hard: {
    arms: [
      { name: "Plyometric Push-ups", reps: 12, sets: 4 },
      { name: "Pike Push-ups", reps: 10, sets: 4 },
      { name: "Close-Grip Push-ups", reps: 15, sets: 4 },
    ],
    legs: [
      { name: "Pistol Squats", reps: 8, sets: 3, perSide: true },
      { name: "Jump Lunges", reps: 20, sets: 4 },
      { name: "Box Jumps", reps: 12, sets: 4 },
    ],
    // ... add more exercises for other body parts
  },
};

export const getRandomWorkout = (level, bmi, targetAreas) => {
  const workout = {
    name: `Custom ${level.charAt(0).toUpperCase() + level.slice(1)} Workout`,
    exercises: [],
    duration: ''
  };

  // Add exercises for each selected body part
  targetAreas.forEach(area => {
    const availableExercises = exercises[level][area];
    if (availableExercises) {
      // Get 1-2 random exercises for each selected area
      const numExercises = Math.floor(Math.random() * 2) + 1;
      const shuffled = [...availableExercises].sort(() => 0.5 - Math.random());
      workout.exercises.push(...shuffled.slice(0, numExercises));
    }
  });

  // Adjust workout based on BMI if needed
  if (bmi >= 30) {
    workout.exercises = workout.exercises.map(exercise => ({
      ...exercise,
      reps: exercise.reps ? Math.floor(exercise.reps * 0.7) : exercise.reps,
      duration: exercise.duration ? 
        exercise.duration.replace(/(\d+)/, (match) => Math.floor(parseInt(match) * 0.7)) : 
        exercise.duration
    }));
  }

  // Determine workout duration
  const totalExercises = workout.exercises.length;
  if (totalExercises <= 3) {
    workout.duration = '1 week';
  } else if (totalExercises <= 6) {
    workout.duration = '2 weeks';
  } else {
    workout.duration = '3 weeks';
  }

  return workout;
}; 