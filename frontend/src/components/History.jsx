import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { FaTrash, FaChevronDown, FaChevronUp, FaHistory, FaCalendarAlt, FaClock, FaFire } from 'react-icons/fa';
import { BiDumbbell } from 'react-icons/bi';

const API_URL = import.meta.env.VITE_API_URL;

const History = () => {
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchCompletedWorkouts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/workouts/${username}/completed`);
        if (response.ok) {
          const data = await response.json();
          const sortedWorkouts = data.sort((a, b) => 
            new Date(b.completedAt) - new Date(a.completedAt)
          );
          setCompletedWorkouts(sortedWorkouts);
        } else {
          console.error('Failed to fetch workout history');
        }
      } catch (error) {
        console.error('Error fetching workout history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCompletedWorkouts();
    } else {
      navigate('/login');
    }
  }, [username, navigate]);

  const handleDelete = async (workoutId) => {
    if (!window.confirm('Are you sure you want to delete this workout from history?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/workouts/${workoutId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCompletedWorkouts(prevWorkouts => 
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 pb-16">
        <div className="text-gray-600 dark:text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your workout history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 pb-16">
      <Header username={username} />
      
      <main className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="p-3 bg-blue-500 dark:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <FaHistory className="text-2xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Workout History</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track your fitness journey</p>
            </div>
          </div>
          
          {completedWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <BiDumbbell className="text-gray-400 dark:text-gray-500 text-4xl sm:text-5xl mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No completed workouts yet. Start your fitness journey today!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedWorkouts.map((workout) => (
                <div
                  key={workout._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                          {workout.workout.name}
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          ({workout.workout.exercises.length} exercises)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="inline-flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(workout.completedAt).toLocaleDateString()}
                        </span>
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
                    <div className="flex items-center space-x-2 justify-end">
                      <button
                        onClick={() => toggleExpand(workout._id)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        aria-label={expandedWorkouts[workout._id] ? "Show less" : "Show more"}
                      >
                        {expandedWorkouts[workout._id] ? (
                          <FaChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(workout._id)}
                        className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        aria-label="Delete workout"
                      >
                        <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {expandedWorkouts[workout._id] && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {workout.workout.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">
                                {exercise.name}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.perSide && ' (per side)'}
                                {exercise.duration && ` • ${exercise.duration}`}
                              </p>
                            </div>
                            <div className="text-blue-500 dark:text-blue-400 ml-2">
                              <BiDumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {workout.pulseRates && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Heart Rate Change</h3>
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${
                              workout.pulseRates.percentageChange > 100 
                                ? 'text-orange-500 dark:text-orange-400'
                                : 'text-green-500 dark:text-green-400'
                            }`}>
                              {workout.pulseRates.difference > 0 ? '+' : ''}{workout.pulseRates.difference} BPM
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div>
                            <p>Initial</p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                              {workout.pulseRates.initial} BPM
                            </p>
                          </div>
                          <div className="text-right">
                            <p>Final</p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                              {workout.pulseRates.final} BPM
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Intensity Level</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  workout.pulseRates.percentageChange <= 50 ? 'bg-green-500' :
                                  workout.pulseRates.percentageChange <= 100 ? 'bg-yellow-500' :
                                  'bg-orange-500'
                                }`}
                                style={{ width: `${Math.min(100, workout.pulseRates.percentageChange)}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                            {workout.pulseRates.percentageChange <= 50 ? 'Light' :
                             workout.pulseRates.percentageChange <= 100 ? 'Moderate' :
                             'Intense'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default History;