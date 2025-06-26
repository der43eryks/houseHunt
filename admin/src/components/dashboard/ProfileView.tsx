import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Lock } from 'lucide-react';
import { adminAPI } from '../../services/api';

const ProfileView: React.FC = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    role: '',
    avatar: 'https://i.pravatar.cc/150?u=admin'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAPI.getProfile();
        if (response.success) {
          setProfileData({
            username: response.data.username || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            role: response.data.role || '',
            avatar: 'https://i.pravatar.cc/150?u=admin'
          });
        } else {
          setError(response.error || 'Failed to fetch profile');
        }
      } catch (err: any) {
        setError(err?.error || err?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await adminAPI.updateProfile({
        username: profileData.username,
        email: profileData.email,
        phone: profileData.phone,
        role: profileData.role
      });
      
      if (response.success) {
        setIsEditing(false);
        // Optionally show success message
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err?.error || err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-blue-600 font-semibold">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {profileData.username}
              </h2>
              <p className="text-gray-600 mb-4 capitalize">{profileData.role}</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone size={16} />
                  <span>{profileData.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={profileData.role}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Change Password</h4>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView; 