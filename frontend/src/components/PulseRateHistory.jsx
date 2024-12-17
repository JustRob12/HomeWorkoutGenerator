import React, { useState, useEffect } from 'react';
import { FaHeartbeat, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const PulseRateHistory = ({ username }) => {
  const [pulseHistory, setPulseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPulseHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/workouts/${username}/pulse-history`);
        if (response.ok) {
          const data = await response.json();
          setPulseHistory(data);
        }
      } catch (error) {
        console.error('Error fetching pulse history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPulseHistory();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (pulseHistory.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center">
          <FaHeartbeat className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Pulse Rate History
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete workouts to track your pulse rate changes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <FaHeartbeat className="mr-2 text-red-500" />
        Pulse Rate History
      </h2>

      <div className="space-y-4">
        {pulseHistory.map((record) => {
          const date = new Date(record.completedAt).toLocaleDateString();
          const time = new Date(record.completedAt).toLocaleTimeString();
          const increased = record.pulseRates.difference > 0;

          return (
            <div
              key={record._id}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {record.workout.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {date} at {time}
                  </p>
                </div>
                <div className={`flex items-center ${
                  increased ? 'text-red-500' : 'text-green-500'
                }`}>
                  {increased ? <FaChevronUp /> : <FaChevronDown />}
                  <span className="ml-1 font-semibold">
                    {record.pulseRates.percentageChange}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Initial Pulse
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {record.pulseRates.initial} BPM
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Final Pulse
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {record.pulseRates.final} BPM
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PulseRateHistory;
