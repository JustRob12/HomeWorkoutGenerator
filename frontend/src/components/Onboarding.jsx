import React, { useState } from 'react';
import { motion } from 'framer-motion';
import cardioImage from '../../assets/onboarding/Cardio.jpg';
import workoutImage from '../../assets/onboarding/istockphoto-1263936563-612x612.jpg';
import progressImage from '../../assets/onboarding/onboard3.jpg';

const OnboardingScreen = () => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      title: "Welcome to HomeWorkout",
      description: "Your personal fitness journey starts here. Create custom workouts tailored to your goals.",
      image: cardioImage
    },
    {
      title: "Personalized Workouts",
      description: "Get workout plans that match your fitness level and available equipment.",
      image: workoutImage
    },
    {
      title: "Track Your Progress",
      description: "Monitor your improvements and stay motivated with detailed progress tracking.",
      image: progressImage
    }
  ];

  const nextScreen = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(prev => prev + 1);
    }
  };

  const skipToLogin = () => {
    // Navigate to login page
    window.location.href = '/login';
  };

  return (
    <motion.div
      key={currentScreen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${screens[currentScreen].image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <div className="relative z-10 max-w-md w-full px-4">
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mb-12">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                index === currentScreen ? 'bg-blue-500' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            {screens[currentScreen].title}
          </h2>
          <p className="text-xl text-white mb-12 opacity-90">
            {screens[currentScreen].description}
          </p>

          <div className="space-y-4">
            {currentScreen < screens.length - 1 ? (
              <>
                <button
                  onClick={nextScreen}
                  className="w-full py-4 px-6 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-lg"
                >
                  Next
                </button>
                <button
                  onClick={skipToLogin}
                  className="w-full py-4 px-6 text-white font-medium hover:text-blue-200 transition-colors text-lg"
                >
                  Skip
                </button>
              </>
            ) : (
              <button
                onClick={skipToLogin}
                className="w-full py-4 px-6 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-lg"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingScreen;
