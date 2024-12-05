import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user data from token payload
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        username: payload.username || 'User',
      });
    } catch (error) {
      console.error('Error parsing token:', error);
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
       <Header username={username} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-[#242938] rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
          
          {/* Mobile-friendly grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example cards - you can replace these with actual content */}
            <div className="bg-[#1a1f2e] p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">Quick Stats</h2>
              <p className="text-gray-400">Your workout statistics will appear here</p>
            </div>
            
            <div className="bg-[#1a1f2e] p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">Recent Workouts</h2>
              <p className="text-gray-400">Your recent workouts will appear here</p>
            </div>
            
            <div className="bg-[#1a1f2e] p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">Goals</h2>
              <p className="text-gray-400">Your fitness goals will appear here</p>
            </div>
          </div>

          {/* Mobile action button */}
          <div className="fixed bottom-6 right-6 md:hidden">
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
