import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1f2e]">
      <div className="bg-[#242938] p-8 rounded-lg w-[400px] shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-4">
            <img src={logo} alt="Logo" className="h-8 w-8" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-center">{error}</div>}
          
          <div>
            <input
              type="text"
              name="username"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#1a1f2e] text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#1a1f2e] text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#1a1f2e] text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center text-gray-400">or</div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg bg-white hover:bg-gray-50 transition duration-200">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg bg-[#1877f2] text-white hover:bg-[#1865d3] transition duration-200">
            <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="mt-6 text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-600">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
