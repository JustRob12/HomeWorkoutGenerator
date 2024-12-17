import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { getRandomWorkout } from '../data/exercises';
import BottomNavigation from './BottomNavigation';
import { FaDumbbell, FaUser, FaWeight, FaRuler, FaTimes, FaSave, FaRunning } from 'react-icons/fa';
import { BiBody } from 'react-icons/bi';
import { GiMuscleUp, GiLeg, GiBiceps, GiChestArmor, GiAbdominalArmor, GiShoulderArmor } from 'react-icons/gi';
import Alert from './Alert';

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
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [targetAreas, setTargetAreas] = useState({
    arms: false,
    legs: false,
    back: false,
    chest: false,
    core: false,
    shoulders: false,
    cardio: false
  });
  const [alert, setAlert] = useState({ type: '', message: '', isVisible: false });
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);

  const bodyPartOptions = [
    { id: 'arms', label: 'Arms', icon: <GiBiceps className="w-6 h-6" /> },
    { id: 'legs', label: 'Legs', icon: <GiLeg className="w-6 h-6" /> },
    { id: 'back', label: 'Back', icon: <GiMuscleUp className="w-6 h-6" /> },
    { id: 'chest', label: 'Chest', icon: <GiChestArmor className="w-6 h-6" /> },
    { id: 'core', label: 'Core', icon: <GiAbdominalArmor className="w-6 h-6" /> },
    { id: 'shoulders', label: 'Shoulders', icon: <GiShoulderArmor className="w-6 h-6" /> },
    { id: 'cardio', label: 'Cardio', icon: <FaRunning className="w-6 h-6" /> }
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
      setAlert({
        type: 'warning',
        message: 'Please enter your weight and height first.',
        isVisible: true
      });
      return;
    }

    const selectedAreas = Object.entries(targetAreas)
      .filter(([_, isSelected]) => isSelected)
      .map(([area]) => area);

    if (selectedAreas.length === 0) {
      setAlert({
        type: 'warning',
        message: 'Please select at least one body part.',
        isVisible: true
      });
      return;
    }

    const generatedWorkout = getRandomWorkout(fitnessLevel, bmiValue, selectedAreas);
    setWorkout(generatedWorkout);
    setShowModal(true);
    setAlert({
      type: 'info',
      message: 'New workout generated! Ready to begin?',
      isVisible: true
    });
  };

  const handleSaveWorkout = async () => {
    if (!workout) {
      setAlert({
        type: 'error',
        message: 'No workout to save.',
        isVisible: true
      });
      return;
    }

    setIsSaving(true);
    try {
      // Ensure all exercise properties are included
      const workoutToSave = {
        ...workout,
        exercises: workout.exercises.map(exercise => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          duration: exercise.duration,
          perSide: exercise.perSide,
          description: exercise.description,
          benefits: exercise.benefits
        }))
      };

      const response = await fetch(`${API_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          workout: workoutToSave,
          status: 'inactive'
        }),
      });

      if (response.ok) {
        setShowSaveSuccessModal(true);
        setWorkout(null);
        setShowModal(false);
        setTimeout(() => {
          setShowSaveSuccessModal(false);
        }, 2000);
      } else {
        setAlert({
          type: 'error',
          message: 'Failed to save workout. Please try again.',
          isVisible: true
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Network error. Please check your connection.',
        isVisible: true
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 pb-16">
      <Header username={username} />
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))}
      />
      
      <main className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="p-3 bg-blue-500 dark:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <FaDumbbell className="text-2xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Workout Generator</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Customize your workout routine</p>
            </div>
          </div>

          {/* Body Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <FaUser className="mr-2 text-blue-500 dark:text-blue-400" /> Body Metrics
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 flex items-center text-sm sm:text-base">
                      <FaWeight className="mr-2 text-gray-600 dark:text-gray-400" /> Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Enter your weight"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 flex items-center text-sm sm:text-base">
                      <FaRuler className="mr-2 text-gray-600 dark:text-gray-400" /> Height (cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      placeholder="Enter your height"
                    />
                  </div>
                </div>
                {bmi && (
                  <div className="mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200 text-sm sm:text-base">Your BMI: {bmi}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <BiBody className="mr-2 text-blue-500 dark:text-blue-400" /> Fitness Level
              </h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFitnessLevel(level)}
                      className={`px-3 sm:px-4 py-2 rounded-lg capitalize transition-colors text-sm sm:text-base ${
                        fitnessLevel === level
                          ? 'bg-blue-500 dark:bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Target Areas Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white">Target Areas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
              {bodyPartOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleTargetAreaChange(option.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                    targetAreas[option.id]
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  } hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors duration-200 shadow-md`}
                >
                  <div className="mb-2">
                    {option.icon}
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerateExercise}
              className="w-full bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center text-base shadow-lg"
            >
              <FaDumbbell className="mr-2" /> Generate Workout
            </button>
          </div>
        </div>
      </main>

      <BottomNavigation />

      {/* Save Success Modal */}
      {showSaveSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 transform transition-all duration-300 scale-100 max-w-sm w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg className="h-10 w-10 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Workout Saved!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Your workout has been successfully saved to your collection.</p>
              <button
                onClick={() => setShowSaveSuccessModal(false)}
                className="w-full bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workout Modal */}
      {showModal && workout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{workout.name}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="grid gap-3 sm:gap-4">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm sm:text-base">{exercise.name}</h3>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-x-2 sm:space-x-4">
                        {exercise.reps && <span>{exercise.reps} reps</span>}
                        {exercise.sets && <span>{exercise.sets} sets</span>}
                        {exercise.duration && <span>{exercise.duration}</span>}
                        {exercise.perSide && <span className="text-blue-600 dark:text-blue-400">Each side</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 sm:space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 sm:px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveWorkout}
                    disabled={isSaving}
                    className="px-4 sm:px-6 py-2 rounded-lg bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center text-sm sm:text-base"
                  >
                    <FaSave className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Workout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
