import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building2,
  Shield,
  Edit3,
  Save,
  X,
  Camera,
  Lock,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';
import { findUser, updateUser } from '../../api/userAPI';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  
  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await findUser(userId);
      const loggedInUser = response.data;
      setUserData(loggedInUser);
      setFormData(loggedInUser);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  const handlePasswordChange = async() => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await updateUser(userId,  passwordData, 'updatePassword' );
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
    }
    catch (error) {
      toast.error('Failed to change password');
    }
  };
  const handleUpdateUser = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await updateUser(userId, formData, 'updateDetails');
      setUserData(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Admin': 'from-purple-500 to-pink-500',
      'Inventory': 'from-blue-500 to-cyan-500',
      'Production': 'from-green-500 to-emerald-500',
      'HR': 'from-orange-500 to-red-500',
      'Assembler': 'from-indigo-500 to-blue-500'
    };
    return colors[department] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your personal information and settings</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Basic Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-4">
              {/* Avatar Section */}
              <div className={`bg-gradient-to-br ${getDepartmentColor(userData?.department)} p-8 text-center relative overflow-hidden`}>
              {/* Background image - cover the entire header */}
              <img 
                className='absolute inset-0 w-full h-full object-cover opacity-20' 
                src="https://res.cloudinary.com/dzn3zqsod/image/upload/v1776571583/WhatsApp_Image_2026-04-19_at_09.34.26_e22jgo.jpg" 
                alt="Background" 
              />
              
              <div className="relative inline-block">
                {/* Profile avatar */}
                <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border-4 border-white shadow-xl overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/dzn3zqsod/image/upload/v1776571583/WhatsApp_Image_2026-04-19_at_09.34.26_e22jgo.jpg" 
                    className='w-full h-full object-cover' 
                    alt="Profile" 
                  />
                </div>
                
                {/* Camera button - already well positioned */}
                <div className="absolute cursor-pointer bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group">
                  <label className="block cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" />
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
                      <Camera className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="sr-only">Upload photo</span>
                  </label>
                  <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                    Change photo
                  </span>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-white mt-4">{userData?.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-white/90 text-sm">{userData?.jobRole}</span>
              </div>
            </div>

              {/* Quick Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-400">Department</p>
                    <p className="font-medium">{userData?.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Briefcase className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-400">Job Role</p>
                    <p className="font-medium">{userData?.jobRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-400">Account Status</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 border-t border-gray-100">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <h3 className="font-bold text-gray-800">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateUser}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-5">
                {/* Name Field */}
                <InfoField
                  icon={<User className="w-5 h-5 text-blue-500" />}
                  label="Full Name"
                  name="name"
                  value={isEditing ? formData?.name : userData?.name}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />

                {/* Username Field */}
                <InfoField
                  icon={<Mail className="w-5 h-5 text-green-500" />}
                  label="Username"
                  name="username"
                  value={isEditing ? formData?.username : userData?.username}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />

                {/* Age Field */}
                <InfoField
                  icon={<Calendar className="w-5 h-5 text-orange-500" />}
                  label="Age"
                  name="age"
                  type="number"
                  value={isEditing ? formData?.age : userData?.age}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />

                {/* Phone Field */}
                <InfoField
                  icon={<Phone className="w-5 h-5 text-purple-500" />}
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={isEditing ? formData?.phoneNumber : userData?.phoneNumber}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit phone number"
                />

                {/* Address Field */}
                <InfoField
                  icon={<MapPin className="w-5 h-5 text-red-500" />}
                  label="Address"
                  name="address"
                  type="textarea"
                  value={isEditing ? formData?.address : userData?.address}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />

                {/* Department & Job Role (Read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-cyan-500 mt-1" />
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Department</label>
                      <p className="font-medium text-gray-800">{userData?.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-indigo-500 mt-1" />
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Job Role</label>
                      <p className="font-medium text-gray-800">{userData?.jobRole}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="font-bold text-gray-800">Account Information</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-800">
                    {new Date(userData?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium text-gray-800">
                    {new Date(userData?.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <PasswordChangeModal
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            showPasswords={showPasswords}
            setShowPasswords={setShowPasswords}
            onSubmit={handlePasswordChange}
            onClose={() => setShowPasswordModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Info Field Component
const InfoField = ({ icon, label, name, type = 'text', value, isEditing, onChange, disabled = false, placeholder }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1">{icon}</div>
    <div className="flex-1">
      <label className="text-xs text-gray-400 uppercase tracking-wider">{label}</label>
      {isEditing && !disabled ? (
        type === 'textarea' ? (
          <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows="2"
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        )
      ) : (
        <p className="font-medium text-gray-800 mt-1">
          {value || <span className="text-gray-400 italic">Not set</span>}
        </p>
      )}
    </div>
  </div>
);

// Password Change Modal
const PasswordChangeModal = ({ passwordData, setPasswordData, showPasswords, setShowPasswords, onClose, onSubmit }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
      
      <div className="space-y-4">
        {['current', 'new', 'confirm'].map((field) => (
          <div key={field}>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {field === 'current' ? 'Current Password' : field === 'new' ? 'New Password' : 'Confirm Password'}
            </label>
            <div className="relative">
              <input
                type={showPasswords[field] ? 'text' : 'password'}
                value={passwordData[field + 'Password']}
                onChange={(e) => setPasswordData(prev => ({ ...prev, [field + 'Password']: e.target.value }))}
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPasswords[field] ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onSubmit}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Change Password
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// Loading Skeleton
const ProfileSkeleton = () => (
  <div className="max-w-6xl mx-auto p-4 md:p-6">
    <div className="h-8 bg-gray-200 rounded-lg w-32 mb-2 animate-pulse" />
    <div className="h-4 bg-gray-200 rounded-lg w-48 mb-6 animate-pulse" />
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6">
        <div className="w-28 h-28 rounded-full bg-gray-200 mx-auto animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-lg w-32 mx-auto mt-4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-lg w-24 mx-auto mt-2 animate-pulse" />
      </div>
      <div className="lg:col-span-2 bg-white rounded-2xl p-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="mb-4">
            <div className="h-3 bg-gray-200 rounded-lg w-20 mb-2 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);