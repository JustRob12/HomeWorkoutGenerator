import express from 'express';
import Workout from '../models/Workout.js';

const router = express.Router();

// Save a workout
router.post('/', async (req, res) => {
  try {
    const { username, workout } = req.body;
    const newWorkout = new Workout({ username, workout });
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save workout' });
  }
});

// Get workouts for a user
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const workouts = await Workout.find({ username });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve workouts' });
  }
});

// Update workout status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, normalPulseRate, recentPulseRate, pulseDifference, pulseIncreasePercentage } = req.body;
    
    const updateData = {
      status,
      ...(status === 'active' ? { 
        activatedAt: new Date(),
        'pulseRates.initial': normalPulseRate 
      } : {}),
      ...(status === 'completed' ? { 
        completedAt: new Date(),
        'pulseRates.final': recentPulseRate,
        'pulseRates.difference': pulseDifference,
        'pulseRates.percentageChange': pulseIncreasePercentage
      } : {})
    };

    const workout = await Workout.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workout status' });
  }
});

// Get completed workouts for a user
router.get('/:username/completed', async (req, res) => {
  try {
    const { username } = req.params;
    const completedWorkouts = await Workout.find({ 
      username, 
      status: 'completed' 
    }).sort({ completedAt: -1 });
    
    res.status(200).json(completedWorkouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve workout history' });
  }
});

// Get pulse rate history for a user
router.get('/:username/pulse-history', async (req, res) => {
  try {
    const { username } = req.params;
    const pulseHistory = await Workout.find({ 
      username, 
      status: 'completed',
      'pulseRates.initial': { $exists: true },
      'pulseRates.final': { $exists: true }
    })
    .select('pulseRates completedAt workout.name')
    .sort({ completedAt: -1 });
    
    res.status(200).json(pulseHistory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve pulse rate history' });
  }
});

// Add delete route
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWorkout = await Workout.findByIdAndDelete(id);
    
    if (!deletedWorkout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

export default router; 