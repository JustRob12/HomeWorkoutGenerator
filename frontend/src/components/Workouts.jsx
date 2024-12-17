import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { FaTrash, FaChevronDown, FaChevronUp, FaDumbbell, FaPlay, 
         FaCheckCircle, FaCalendarAlt, FaClock, FaFire, FaStar } from 'react-icons/fa';
import { BiDumbbell } from 'react-icons/bi';
import ExerciseTimer from './ExerciseTimer';
import { getExerciseIcon } from '../data/exerciseIcons';

const API_URL = import.meta.env.VITE_API_URL;

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const [expandedExercises, setExpandedExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [pulseRateModalOpen, setPulseRateModalOpen] = useState(false);
  const [completePulseRateModalOpen, setCompletePulseRateModalOpen] = useState(false);
  const [normalPulseRate, setNormalPulseRate] = useState('');
  const [recentPulseRate, setRecentPulseRate] = useState('');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [workoutResults, setWorkoutResults] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/workouts/${username}`);
      if (response.ok) {
        const data = await response.json();
        const filteredWorkouts = data
          .filter(workout => workout.status !== 'completed')
          .sort((a, b) => {
            if (a.status === 'active' && b.status !== 'active') return -1;
            if (b.status === 'active' && a.status !== 'active') return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        setWorkouts(filteredWorkouts);
      } else {
        console.error('Failed to fetch workouts');
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchWorkouts();
    } else {
      navigate('/login');
    }
  }, [username, navigate]);

  const handleStartWorkout = async (workoutId) => {
    if (!normalPulseRate) {
      setSelectedWorkoutId(workoutId);
      setPulseRateModalOpen(true);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/workouts/${workoutId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'active',
          normalPulseRate: normalPulseRate
        }),
      });

      if (response.ok) {
        fetchWorkouts();
      } else {
        console.error('Failed to start workout');
      }
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  const handleCompleteWorkout = async (workoutId) => {
    if (!recentPulseRate) {
      setSelectedWorkoutId(workoutId);
      setCompletePulseRateModalOpen(true);
      return;
    }

    // Calculate pulse rate difference
    const initialPulse = parseInt(normalPulseRate);
    const finalPulse = parseInt(recentPulseRate);
    const pulseDifference = finalPulse - initialPulse;
    const pulseIncreasePercentage = ((finalPulse - initialPulse) / initialPulse * 100).toFixed(1);

    try {
      const response = await fetch(`${API_URL}/api/workouts/${workoutId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'completed',
          normalPulseRate: initialPulse,
          recentPulseRate: finalPulse,
          pulseDifference: pulseDifference,
          pulseIncreasePercentage: pulseIncreasePercentage
        }),
      });

      if (response.ok) {
        setWorkouts(prevWorkouts => 
          prevWorkouts.filter(workout => workout._id !== workoutId)
        );
        
        // Set workout results and show modal
        setWorkoutResults({
          initialPulse,
          finalPulse,
          pulseDifference,
          pulseIncreasePercentage
        });
        setShowResultModal(true);

        // Reset states
        setNormalPulseRate('');
        setRecentPulseRate('');
      } else {
        console.error('Failed to complete workout');
      }
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  const handleDelete = async (workoutId) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/workouts/${workoutId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWorkouts(prevWorkouts => 
          prevWorkouts.filter(workout => workout._id !== workoutId)
        );
      } else {
        console.error('Failed to delete workout');
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const toggleExpand = (workoutId) => {
    setExpandedWorkouts(prev => ({
      ...prev,
      [workoutId]: !prev[workoutId]
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm px-3 py-1 rounded-full font-medium flex items-center">
            <FaPlay className="mr-2" size={12} />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm px-3 py-1 rounded-full font-medium flex items-center">
            <FaDumbbell className="mr-2" size={12} />
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusButton = (workout) => {
    switch (workout.status) {
      case 'inactive':
        return (
          <button
            onClick={() => handleStartWorkout(workout._id)}
            className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FaPlay size={14} />
            <span>Start Workout</span>
          </button>
        );
      case 'active':
        return (
          <button
            onClick={() => handleCompleteWorkout(workout._id)}
            className="bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FaCheckCircle size={14} />
            <span>Complete Workout</span>
          </button>
        );
      default:
        return null;
    }
  };

  const handleStartExercise = (exercise) => {
    if (!exercise) return;
    setCurrentExercise(exercise);
    setCurrentSet(1);
    setTimerModalOpen(true);
  };

  const handleSetComplete = () => {
    if (!currentExercise) return;
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
    } else {
      setTimerModalOpen(false);
      setCurrentSet(1);
      setCurrentExercise(null);
    }
  };

  const validatePulseRate = (value) => {
    const pulseRate = parseInt(value);
    return pulseRate > 0 && pulseRate <= 400; // Increased maximum to accommodate post-workout rates
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-gray-600 dark:text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
          <p>Loading your workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 pb-16">
      <Header username={username} />
      
      <main className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="p-3 bg-green-500 dark:bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <BiDumbbell className="text-2xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">My Workouts</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">View and manage your saved workouts</p>
            </div>
          </div>

          {workouts.length === 0 ? (
            <div className="text-center py-8">
              <BiDumbbell className="text-gray-400 dark:text-gray-500 text-4xl sm:text-5xl mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No saved workouts yet. Generate a new workout to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workouts.map((workout) => (
                <div
                  key={workout._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative group"
                >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(workout._id)}
                      className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                      aria-label="Delete workout"
                    >
                      <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                      <BiDumbbell className="text-green-600 dark:text-green-300 text-xl sm:text-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white truncate">
                        {workout.workout.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <FaClock className="mr-1" />
                          {workout.workout.duration}
                        </span>
                        <span className="inline-flex items-center text-xs sm:text-sm text-orange-600 dark:text-orange-400">
                          <FaFire className="mr-1" />
                          {workout.workout.exercises.length * 10} calories
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Exercises ({workout.workout.exercises.length})
                    </div>
                    <div className="space-y-2">
                      {workout.workout.exercises.slice(0, expandedWorkouts[workout._id] ? undefined : 3).map((exercise, index) => (
                        <div
                          key={index}
                          className="flex flex-col space-y-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                        >
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {(() => {
                                  const IconComponent = getExerciseIcon(exercise.name);
                                  return <IconComponent className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
                                })()}
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                  {exercise.name}
                                </h3>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => handleStartExercise(exercise)}
                                className="flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                              >
                                <FaClock className="mr-2 h-4 w-4" />
                                Start Timer
                              </button>
                              <button
                                onClick={() => {
                                  setExpandedExercises(prev => ({
                                    ...prev,
                                    [workout._id + '-' + index]: !prev[workout._id + '-' + index]
                                  }));
                                }}
                                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                                  expandedExercises[workout._id + '-' + index]
                                    ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                                }`}
                              >
                                {expandedExercises[workout._id + '-' + index] ? (
                                  <>
                                    <FaChevronUp className="mr-2 h-4 w-4" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <FaChevronDown className="mr-2 h-4 w-4" />
                                    Show Details
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {expandedExercises[workout._id + '-' + index] && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sets</p>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{exercise.sets}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {exercise.duration ? 'Duration' : 'Reps'}
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {exercise.duration || exercise.reps}
                                  </p>
                                </div>
                              </div>

                              {exercise.description && (
                                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Instructions:</p>
                                  <p className="text-gray-800 dark:text-gray-200 text-sm">{exercise.description}</p>
                                </div>
                              )}

                              {exercise.benefits && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <FaStar className="text-blue-500 dark:text-blue-400 h-4 w-4" />
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Benefits:</p>
                                  </div>
                                  <p className="text-gray-800 dark:text-gray-200 text-sm">{exercise.benefits}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {workout.workout.exercises.length > 3 && (
                      <button
                        onClick={() => toggleExpand(workout._id)}
                        className="mt-3 w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        {expandedWorkouts[workout._id] ? 'Show less' : `Show ${workout.workout.exercises.length - 3} more`}
                      </button>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    {getStatusButton(workout)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNavigation />

      <ExerciseTimer
        isOpen={timerModalOpen}
        onClose={() => setTimerModalOpen(false)}
        exercise={currentExercise}
        currentSet={currentSet}
        totalSets={currentExercise?.sets || 0}
        onSetComplete={handleSetComplete}
      />

      {pulseRateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Initial Pulse Rate</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Let's measure your resting heart rate</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Pulse Rate (BPM)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={normalPulseRate}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || validatePulseRate(value)) {
                          setNormalPulseRate(value);
                        }
                      }}
                      min="1"
                      max="400"
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white text-lg font-medium
                               transition-all duration-200"
                      placeholder="Enter pulse rate"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">BPM</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Normal Range</h3>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                        A normal resting heart rate is typically between 60-100 BPM for adults
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setPulseRateModalOpen(false);
                    setSelectedWorkoutId(null);
                    setNormalPulseRate('');
                  }}
                  className="px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                           dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (normalPulseRate && validatePulseRate(normalPulseRate)) {
                      setPulseRateModalOpen(false);
                      handleStartWorkout(selectedWorkoutId);
                      setSelectedWorkoutId(null);
                    }
                  }}
                  disabled={!normalPulseRate || !validatePulseRate(normalPulseRate)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl
                           transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center space-x-2"
                >
                  <span>Start Workout</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {completePulseRateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Final Pulse Rate</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Great workout! Let's check your heart rate</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Initial Pulse Rate:</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{normalPulseRate} BPM</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Pulse Rate (BPM)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={recentPulseRate}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || validatePulseRate(value)) {
                          setRecentPulseRate(value);
                        }
                      }}
                      min="1"
                      max="400"
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white text-lg font-medium
                               transition-all duration-200"
                      placeholder="Enter pulse rate"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">BPM</span>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-green-500 dark:text-green-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Post-Workout</h3>
                      <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                        It's normal for your heart rate to be elevated after exercise
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setCompletePulseRateModalOpen(false);
                    setSelectedWorkoutId(null);
                    setRecentPulseRate('');
                  }}
                  className="px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                           dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (recentPulseRate && validatePulseRate(recentPulseRate)) {
                      setCompletePulseRateModalOpen(false);
                      handleCompleteWorkout(selectedWorkoutId);
                      setSelectedWorkoutId(null);
                    }
                  }}
                  disabled={!recentPulseRate || !validatePulseRate(recentPulseRate)}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl
                           transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center space-x-2"
                >
                  <span>Complete Workout</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Workout Complete! 🎉</h2>
                <p className="text-gray-600 dark:text-gray-400">Here's your heart rate progress</p>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Initial Pulse */}
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Initial Pulse</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline">
                    {workoutResults?.initialPulse}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">BPM</span>
                  </div>
                </div>

                {/* Final Pulse */}
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl">
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-1">Final Pulse</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline">
                    {workoutResults?.finalPulse}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">BPM</span>
                  </div>
                </div>

                {/* Pulse Change */}
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl">
                  <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">Pulse Change</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline">
                    {workoutResults?.pulseDifference > 0 ? '+' : ''}{workoutResults?.pulseDifference}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">BPM</span>
                  </div>
                </div>

                {/* Percentage Change */}
                <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-xl">
                  <div className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-1">% Change</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline">
                    {workoutResults?.pulseIncreasePercentage}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">%</span>
                  </div>
                </div>
              </div>

              {/* Insight Message */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {workoutResults?.pulseDifference > 0 
                        ? "Great intensity! Your elevated heart rate shows you've had an effective workout." 
                        : "Your heart rate has returned to normal, showing good recovery!"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowResultModal(false);
                    setWorkoutResults(null);
                  }}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl
                           transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Close</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;