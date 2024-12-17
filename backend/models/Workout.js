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
        description: { type: String, default: '' },
        benefits: { type: String, default: '' }
      },
    ],
  },
  status: {
    type: String,
    enum: ['inactive', 'active', 'completed'],
    default: 'inactive'
  },
  pulseRates: {
    initial: { type: Number, min: 1, max: 400 },
    final: { type: Number, min: 1, max: 400 },
    difference: Number,
    percentageChange: Number
  },
  createdAt: { type: Date, default: Date.now },
  activatedAt: Date,
  completedAt: Date
});

export default mongoose.model('Workout', workoutSchema);