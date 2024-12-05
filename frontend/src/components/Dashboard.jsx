import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { getRandomWorkout } from '../data/exercises';
import BottomNavigation from './BottomNavigation';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const [fitnessLevel, setFitnessLevel] = useState('beginner');
  const [workout, setWorkout] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [targetAreas, setTargetAreas] = useState({
    arms: false,
    legs: false,
    back: false,
    chest: false,
    core: false,
    shoulders: false,
    cardio: false
  });

  const bodyPartOptions = [
    { id: 'arms', label: 'Arms' },
    { id: 'legs', label: 'Legs' },
    { id: 'back', label: 'Back' },
    { id: 'chest', label: 'Chest' },
    { id: 'core', label: 'Core' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'cardio', label: 'Cardio' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user data from token payload
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        username: payload.username || 'User',
      });
    } catch (error) {
      console.error('Error parsing token:', error);
      navigate('/login');
    }
  }, [navigate]);

  const calculateBMI = () => {
    if (weight && height) {
      // Convert height from cm to meters
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
      return bmiValue;
    }
    return null;
  };

  const handleTargetAreaChange = (area) => {
    setTargetAreas(prev => ({
      ...prev,
      [area]: !prev[area]
    }));
  };

  const handleGenerateExercise = () => {
    const bmiValue = calculateBMI();
    if (!bmiValue) {
      alert('Please enter your weight and height first');
      return;
    }

    const selectedAreas = Object.entries(targetAreas)
      .filter(([_, isSelected]) => isSelected)
      .map(([area]) => area);

    if (selectedAreas.length === 0) {
      alert('Please select at least one body part');
      return;
    }

    const generatedWorkout = getRandomWorkout(fitnessLevel, bmiValue, selectedAreas);
    setWorkout(generatedWorkout);
  };

  const handleSaveWorkout = async () => {
    if (!workout) {
      alert('No workout to save');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          workout: workout
        }),
      });

      if (response.ok) {
        alert('Workout saved successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save workout');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Error saving workout');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
       <Header username={username} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        <div className="bg-[#242938] rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
          
          {/* BMI Input Form */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Weight (kg):</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-[#1a1f2e] text-white p-2 rounded w-full"
                placeholder="Enter weight in kg"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Height (cm):</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-[#1a1f2e] text-white p-2 rounded w-full"
                placeholder="Enter height in cm"
              />
            </div>
          </div>

          {/* BMI Display */}
          {bmi && (
            <div className="mb-6 p-4 bg-[#1a1f2e] rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">Your BMI: {bmi}</h2>
              <p className="text-gray-400">
                {bmi < 18.5 && 'Underweight - Focus on strength building exercises'}
                {bmi >= 18.5 && bmi < 25 && 'Normal weight - Maintain with balanced exercises'}
                {bmi >= 25 && bmi < 30 && 'Overweight - Include more cardio exercises'}
                {bmi >= 30 && 'Obese - Start with low-impact exercises'}
              </p>
            </div>
          )}

          {/* User input form for exercise generation */}
          <div className="mb-6">
            <label className="block text-white mb-2">Select Fitness Level:</label>
            <select
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
              className="bg-[#1a1f2e] text-white p-2 rounded"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="hard">Hard</option>
            </select>
            <button
              onClick={handleGenerateExercise}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded ml-4"
            >
              Generate Workout
            </button>
          </div>

          {/* Target Area Selection */}
          <div className="mb-6">
            <label className="block text-white mb-3">Target Body Parts:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {bodyPartOptions.map(({ id, label }) => (
                <div key={id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={id}
                    checked={targetAreas[id]}
                    onChange={() => handleTargetAreaChange(id)}
                    className="w-4 h-4 text-blue-600 bg-[#1a1f2e] border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={id} className="ml-2 text-white">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Display generated workout */}
          {workout && (
            <div className="bg-[#1a1f2e] p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">{workout.name}</h2>
              <p className="text-gray-400 mb-4">Duration: {workout.duration}</p>
              <div className="space-y-4">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="text-gray-400">
                    <h3 className="text-white font-medium">{exercise.name}</h3>
                    <p>
                      {exercise.reps && `${exercise.reps} reps`}
                      {exercise.sets && ` × ${exercise.sets} sets`}
                      {exercise.duration && ` for ${exercise.duration}`}
                      {exercise.perSide && ' (each side)'}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSaveWorkout}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded mt-4"
              >
                Save Workout
              </button>
            </div>
          )}

         
          
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
