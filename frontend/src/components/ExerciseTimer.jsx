import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';

const ExerciseTimer = ({ isOpen, onClose, exercise, currentSet, totalSets, onSetComplete }) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (exercise) {
      setTimeLeft(exercise.duration ? parseTime(exercise.duration) : 45);
    }
  }, [exercise]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      handleSetComplete();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    // Reset timer when exercise changes
    if (exercise) {
      setTimeLeft(exercise.duration ? parseTime(exercise.duration) : 45);
    }
    setIsRunning(false);
    setIsPaused(false);
  }, [exercise, currentSet]);

  const parseTime = (duration) => {
    if (!duration) return 45;
    const match = duration.toString().match(/(\d+)/);
    return match ? parseInt(match[0]) : 45;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleReset = () => {
    if (exercise) {
      setTimeLeft(exercise.duration ? parseTime(exercise.duration) : 45);
    }
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleSetComplete = () => {
    setIsRunning(false);
    if (onSetComplete) {
      onSetComplete();
    }
  };

  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {exercise.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Set {currentSet} of {totalSets}
          </p>
          
          <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
              >
                <FaPlay className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full"
              >
                <FaPause className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full"
            >
              <FaRedo className="w-6 h-6" />
            </button>
          </div>

          {exercise.description && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-left">
              <h4 className="font-semibold mb-1">Instructions:</h4>
              <p>{exercise.description}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTimer;
