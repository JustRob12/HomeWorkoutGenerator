import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { FaTrash, FaChevronDown, FaChevronUp, FaDumbbell, FaPlay, 
         FaCheckCircle, FaCalendarAlt, FaClock, FaFire } from 'react-icons/fa';
import { BiDumbbell } from 'react-icons/bi';

const API_URL = import.meta.env.VITE_API_URL;

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const [loading, setLoading] = useState(true);
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

  const handleStatusUpdate = async (workoutId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/workouts/${workoutId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        if (newStatus === 'completed') {
          setWorkouts(prevWorkouts => 
            prevWorkouts.filter(workout => workout._id !== workoutId)
          );
        } else {
          fetchWorkouts();
        }
      } else {
        console.error('Failed to update workout status');
      }
    } catch (error) {
      console.error('Error updating workout status:', error);
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
            onClick={() => handleStatusUpdate(workout._id, 'active')}
            className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FaPlay size={14} />
            <span>Start Workout</span>
          </button>
        );
      case 'active':
        return (
          <button
            onClick={() => handleStatusUpdate(workout._id, 'completed')}
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Header username={username} />
      
      <main className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-8">
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
                          className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                              {exercise.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.perSide && ' (per side)'}
                              {exercise.duration && ` • ${exercise.duration}`}
                            </p>
                          </div>
                          <div className="text-blue-500 dark:text-blue-400 ml-2">
                            <BiDumbbell className="w-4 h-4" />
                          </div>
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
    </div>
  );
};

export default Workouts;