import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  username: { type: String, required: true },
  workout: {
    name: String,
    duration: String,
    exercises: [
      {
        name: String,
        reps: Number,
        sets: Number,
        duration: String,
        perSide: Boolean,
      },
    ],
  },
  status: {
    type: String,
    enum: ['inactive', 'active', 'completed'],
    default: 'inactive'
  },
  createdAt: { type: Date, default: Date.now },
  activatedAt: Date,
  completedAt: Date
});

export default mongoose.model('Workout', workoutSchema); 