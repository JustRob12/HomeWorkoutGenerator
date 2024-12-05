import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

  const getStatusButton = (workout) => {
    switch (workout.status) {
      case 'inactive':
        return (
          <button
            onClick={() => handleStatusUpdate(workout._id, 'active')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Activate
          </button>
        );
      case 'active':
        return (
          <button
            onClick={() => handleStatusUpdate(workout._id, 'completed')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Mark as Done
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] pb-20">
      <Header username={username} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-[#242938] rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">My Active Workouts</h1>
          
          {workouts.length === 0 ? (
            <p className="text-gray-400">No active workouts. Create a new workout in the Dashboard!</p>
          ) : (
            <div className="space-y-4">
              {workouts.map((savedWorkout, index) => (
                <div 
                  key={index} 
                  className={`bg-[#1a1f2e] p-6 rounded-lg ${
                    savedWorkout.status === 'active' ? 'border-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {savedWorkout.workout.name}
                      </h2>
                      <span className="text-sm text-gray-400">
                        Status: {savedWorkout.status.charAt(0).toUpperCase() + savedWorkout.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 bg-[#242938] px-3 py-1 rounded-full text-sm">
                        {savedWorkout.workout.duration}
                      </span>
                      <button
                        onClick={() => toggleExpand(savedWorkout._id)}
                        className="text-white hover:text-gray-300 p-2 rounded transition-colors"
                        title={expandedWorkouts[savedWorkout._id] ? "Minimize" : "Expand"}
                      >
                        {expandedWorkouts[savedWorkout._id] ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button
                        onClick={() => handleDelete(savedWorkout._id)}
                        className="text-red-500 hover:text-red-600 p-2 rounded transition-colors"
                        title="Delete workout"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  {expandedWorkouts[savedWorkout._id] && (
                    <div className="space-y-4">
                      {savedWorkout.workout.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="text-gray-400">
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
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      <p>Created on: {new Date(savedWorkout.createdAt).toLocaleDateString()}</p>
                      <p>Program Length: {savedWorkout.workout.duration}</p>
                    </div>
                    {getStatusButton(savedWorkout)}
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