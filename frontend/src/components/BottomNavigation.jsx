import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiDashboardFill } from 'react-icons/ri';
import { CgGym } from 'react-icons/cg';
import { VscHistory } from 'react-icons/vsc';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#242938] p-4 flex justify-around">
      <button 
        className={`flex flex-col items-center space-y-1 ${
          location.pathname === '/dashboard' 
            ? 'text-blue-500' 
            : 'text-gray-400 hover:text-white'
        }`}
        onClick={() => navigate('/dashboard')}
      >
        <RiDashboardFill className="text-2xl" />
        <span className="text-xs">Dashboard</span>
      </button>
      
      <button 
        className={`flex flex-col items-center space-y-1 ${
          location.pathname === '/workouts' 
            ? 'text-blue-500' 
            : 'text-gray-400 hover:text-white'
        }`}
        onClick={() => navigate('/workouts')}
      >
        <CgGym className="text-2xl" />
        <span className="text-xs">Workouts</span>
      </button>

      <button 
        className={`flex flex-col items-center space-y-1 ${
          location.pathname === '/history' 
            ? 'text-blue-500' 
            : 'text-gray-400 hover:text-white'
        }`}
        onClick={() => navigate('/history')}
      >
        <VscHistory className="text-2xl" />
        <span className="text-xs">History</span>
      </button>
    </nav>
  );
};

export default BottomNavigation; 