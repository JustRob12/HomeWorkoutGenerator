import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Alert = ({ type = 'info', message, isVisible, onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoClose]);

  if (!isVisible) return null;

  const alertStyles = {
    success: {
      bg: 'bg-green-100',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: <FaCheckCircle className="text-green-500" size={20} />,
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: <FaExclamationCircle className="text-red-500" size={20} />,
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-500',
      text: 'text-blue-800',
      icon: <FaInfoCircle className="text-blue-500" size={20} />,
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      icon: <FaExclamationCircle className="text-yellow-500" size={20} />,
    },
  };

  const style = alertStyles[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`${style.bg} ${style.border} ${style.text} border-l-4 rounded-lg shadow-lg p-4 max-w-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {style.icon}
            <p className="font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-75 transition-opacity`}
          >
            <FaTimes size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
