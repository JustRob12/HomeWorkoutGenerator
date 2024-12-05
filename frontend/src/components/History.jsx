import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
          <h1 className="text-2xl font-bold text-white mb-6">Workout History</h1>
          
          {completedWorkouts.length === 0 ? (
            <p className="text-gray-400">No completed workouts yet.</p>
          ) : (
            <div className="space-y-4">
              {completedWorkouts.map((workout, index) => (
                <div key={index} className="bg-[#1a1f2e] p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {workout.workout.name}
                      </h2>
                      <span className="text-sm text-green-400">
                        Completed on: {new Date(workout.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 bg-[#242938] px-3 py-1 rounded-full text-sm">
                        {workout.workout.duration}
                      </span>
                      <button
                        onClick={() => toggleExpand(workout._id)}
                        className="text-white hover:text-gray-300 p-2 rounded transition-colors"
                        title={expandedWorkouts[workout._id] ? "Minimize" : "Expand"}
                      >
                        {expandedWorkouts[workout._id] ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button
                        onClick={() => handleDelete(workout._id)}
                        className="text-red-500 hover:text-red-600 p-2 rounded transition-colors"
                        title="Delete from history"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  {expandedWorkouts[workout._id] && (
                    <div className="space-y-4">
                      {workout.workout.exercises.map((exercise, exerciseIndex) => (
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
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Started on: {new Date(workout.activatedAt).toLocaleDateString()}</p>
                    <p>Program Length: {workout.workout.duration}</p>
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

export default History; 