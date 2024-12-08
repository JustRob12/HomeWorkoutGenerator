import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiDashboardFill } from 'react-icons/ri';
import { CgGym } from 'react-icons/cg';
import { VscHistory } from 'react-icons/vsc';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-lg mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          <button 
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors ${
              location.pathname === '/dashboard' 
                ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
            }`}
            onClick={() => navigate('/dashboard')}
            aria-label="Dashboard"
          >
            <RiDashboardFill className="text-lg sm:text-xl" />
            <span className="text-[10px] sm:text-xs mt-1">Dashboard</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors ${
              location.pathname === '/workouts' 
                ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
            }`}
            onClick={() => navigate('/workouts')}
            aria-label="Workouts"
          >
            <CgGym className="text-lg sm:text-xl" />
            <span className="text-[10px] sm:text-xs mt-1">Workouts</span>
          </button>

          <button 
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors ${
              location.pathname === '/history' 
                ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
            }`}
            onClick={() => navigate('/history')}
            aria-label="History"
          >
            <VscHistory className="text-lg sm:text-xl" />
            <span className="text-[10px] sm:text-xs mt-1">History</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;