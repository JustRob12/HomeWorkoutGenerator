import React, { useState, useEffect } from 'react';
import { FaCamera, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Profile = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
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
    } catch (error) {
      console.error('Error fetching profile:', error);
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

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      <Header username={username} />
      <div className="flex items-center justify-center pt-8">
        <div className="bg-[#242938] p-8 rounded-lg w-[400px] shadow-lg relative">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="absolute top-4 left-4 text-gray-400 hover:text-white transition duration-200"
          >
            <FaArrowLeft size={20} />
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Profile</h2>
          
          {/* Image Upload Circle */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className={`w-full h-full rounded-full overflow-hidden border-4 border-gray-700 ${!preview ? 'bg-gray-700' : ''}`}>
              {preview ? (
                <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaCamera className="text-gray-400 text-3xl" />
                </div>
              )}
            </div>
            <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition duration-200">
              <FaCamera className="text-white text-sm" />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* User Information */}
          <div className="space-y-4 mb-6">
            <div className="space-y-1">
              <label className="text-gray-400 text-sm">Username</label>
              <div className="bg-[#1a1f2e] text-white px-4 py-3 rounded-lg">
                {username}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-gray-400 text-sm">Email</label>
              <div className="bg-[#1a1f2e] text-white px-4 py-3 rounded-lg">
                {email}
              </div>
            </div>
          </div>

          {/* Save Button */}
          {image && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
            >
              {loading ? 'Uploading...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 