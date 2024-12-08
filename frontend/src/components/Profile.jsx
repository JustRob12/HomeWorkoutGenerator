import React, { useState, useEffect } from 'react';
import { FaCamera, FaArrowLeft, FaUser, FaEnvelope, FaMedal, FaCalendarAlt, FaDumbbell, FaFire, FaClock, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

const Profile = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [streak, setStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [joinDate, setJoinDate] = useState('');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchWorkoutStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.avatar) {
        setPreview(`${import.meta.env.VITE_API_URL}${data.avatar}`);
      }
      setJoinDate(data.joinDate);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchWorkoutStats = async () => {
    try {
      // Fetch completed workouts
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workouts/${username}/completed`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const completedWorkouts = await response.json();
      
      if (response.ok) {
        setWorkouts(completedWorkouts);
        setTotalWorkouts(completedWorkouts.length);
        
        // Calculate streak
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sortedWorkouts = completedWorkouts.sort((a, b) => 
          new Date(b.completedAt) - new Date(a.completedAt)
        );
        
        if (sortedWorkouts.length > 0) {
          let lastWorkoutDate = new Date(sortedWorkouts[0].completedAt);
          lastWorkoutDate.setHours(0, 0, 0, 0);
          
          // Check if the last workout was today or yesterday
          const timeDiff = Math.floor((today - lastWorkoutDate) / (1000 * 60 * 60 * 24));
          if (timeDiff <= 1) {
            currentStreak = 1;
            lastWorkoutDate.setDate(lastWorkoutDate.getDate() - 1);
            
            // Count consecutive days
            for (let i = 1; i < sortedWorkouts.length; i++) {
              const workoutDate = new Date(sortedWorkouts[i].completedAt);
              workoutDate.setHours(0, 0, 0, 0);
              
              if (workoutDate.getTime() === lastWorkoutDate.getTime()) {
                currentStreak++;
                lastWorkoutDate.setDate(lastWorkoutDate.getDate() - 1);
              } else {
                break;
              }
            }
          }
        }
        setStreak(currentStreak);
      }
    } catch (error) {
      console.error('Error fetching workout stats:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('avatar', image);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setPreview(`${import.meta.env.VITE_API_URL}${data.avatar}`);
        setImage(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setWorkouts(workouts.filter(workout => workout._id !== workoutId));
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Header username={username} />
      
      <main className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* User Info Card */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-4xl sm:text-5xl text-white" />
                  )}
                </div>
                <label 
                  htmlFor="image-upload" 
                  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-full p-2 sm:p-3 cursor-pointer transition-colors duration-200 shadow-lg"
                >
                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <FaCamera className="text-white text-sm sm:text-base" />
                </label>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mt-4 mb-2">{username}</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Member since {joinDate}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center mb-2 sm:mb-0">
                  <FaFire className="text-orange-500 dark:text-orange-400 mr-2" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Current Streak</span>
                </div>
                <span className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">{streak} days</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center mb-2 sm:mb-0">
                  <FaDumbbell className="text-blue-500 dark:text-blue-400 mr-2" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Total Workouts</span>
                </div>
                <span className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">{totalWorkouts}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center mb-2 sm:mb-0">
                  <FaClock className="text-green-500 dark:text-green-400 mr-2" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Total Time</span>
                </div>
                <span className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">{totalTime}</span>
              </div>
            </div>

          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                {workouts.length > 0 ? (
                  workouts.slice(0, 5).map((workout, index) => (
                    <div 
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">{workout.workout.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1 text-blue-500 dark:text-blue-400" />
                            {new Date(workout.completedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <FaClock className="mr-1 text-blue-500 dark:text-blue-400" />
                            {workout.workout.duration}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {workout.workout.exercises.map((exercise, exerciseIndex) => (
                          <div 
                            key={exerciseIndex}
                            className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-2">{exercise.name}</h4>
                            <div className="text-xs space-x-2 text-gray-600 dark:text-gray-400">
                              {exercise.reps && <span>{exercise.reps} reps</span>}
                              {exercise.sets && <span>{exercise.sets} sets</span>}
                              {exercise.duration && <span>{exercise.duration}</span>}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleDeleteWorkout(workout._id)}
                          className="text-sm px-3 py-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center"
                        >
                          <FaTrash className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center">No workouts completed yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Profile;