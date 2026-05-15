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
  CheckCircle2,
  AlertCircle,
  Award,
  Clock,
  Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { findUser, updateUser } from '../../api/userAPI';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone must be 10 digits';
    }
    if (formData.age && (formData.age < 18 || formData.age > 100)) {
      newErrors.age = 'Age must be between 18 and 100';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
    toast.success('Image selected. Click Save to apply.');
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];
    return { score, ...levels[score] };
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      const userId = localStorage.getItem('userId');
      await updateUser(userId, passwordData, 'updatePassword');
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleUpdateUser = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    setSaving(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await updateUser(userId, formData, 'updateDetails');
      setUserData(response.data);
      setIsEditing(false);
      setPreviewImage(null);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(userData);
    setIsEditing(false);
    setErrors({});
    setPreviewImage(null);
  };

  const getDepartmentColor = (department) => {
    const colors = {
      Admin: 'from-purple-500 via-pink-500 to-rose-500',
      Inventory: 'from-blue-500 via-cyan-500 to-teal-500',
      Production: 'from-green-500 via-emerald-500 to-teal-500',
      HR: 'from-orange-500 via-red-500 to-pink-500',
      Assembler: 'from-indigo-500 via-blue-500 to-cyan-500',
      Manager: 'from-amber-500 via-orange-500 to-red-500',
    };
    return colors[department] || 'from-gray-500 to-gray-700';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const calculateProfileCompletion = () => {
    if (!userData) return 0;
    const fields = ['name', 'username', 'age', 'phoneNumber', 'address', 'department', 'jobRole'];
    const filled = fields.filter((f) => userData[f]).length;
    return Math.round((filled / fields.length) * 100);
  };

  if (loading) return <ProfileSkeleton />;

  const completion = calculateProfileCompletion();

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between flex-wrap gap-3"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your personal information and settings
            </p>
          </div>

          {/* Profile Completion */}
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${completion}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                  {completion}%
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Profile</p>
                <p className="text-sm font-semibold text-gray-800">Completion</p>
              </div>
            </div>
          </div>
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
              <div
                className={`bg-gradient-to-br ${getDepartmentColor(
                  userData?.department
                )} p-8 text-center relative overflow-hidden`}
              >
                {/* Animated decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full" />

                <div className="relative inline-block">
                  {/* Profile avatar */}
                  <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border-4 border-white shadow-xl overflow-hidden">
                    {previewImage || userData?.profileImage ? (
                      <img
                        src={previewImage || userData?.profileImage}
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {getInitials(userData?.name)}
                      </span>
                    )}
                  </div>

                  {/* Camera button */}
                  <label className="absolute cursor-pointer bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Camera className="w-5 h-5 text-gray-700" />
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                      Change photo
                    </span>
                  </label>
                </div>

                <h2 className="text-xl font-bold text-white mt-4">
                  {userData?.name}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-white/90 text-sm">
                    {userData?.jobRole}
                  </span>
                </div>

                {/* Stats badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <Award className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-medium text-white">
                    {userData?.department} Team
                  </span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="p-6 space-y-4">
                <QuickInfoItem
                  icon={<Building2 className="w-5 h-5 text-blue-500" />}
                  label="Department"
                  value={userData?.department}
                />
                <QuickInfoItem
                  icon={<Briefcase className="w-5 h-5 text-green-500" />}
                  label="Job Role"
                  value={userData?.jobRole}
                />
                <QuickInfoItem
                  icon={<Shield className="w-5 h-5 text-purple-500" />}
                  label="Account Status"
                  value={
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Active
                    </span>
                  }
                />
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 border-t border-gray-100">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-xl font-medium transition-all border border-gray-200 hover:border-gray-300 hover:shadow-md"
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
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-gray-800">
                    Personal Information
                  </h3>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateUser}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all shadow-md shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Edit mode banner */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <p className="text-sm text-blue-700">
                    You are in edit mode. Make your changes and click Save to apply.
                  </p>
                </motion.div>
              )}

              {/* Form Fields */}
              <div className="p-6 space-y-5">
                <InfoField
                  icon={<User className="w-5 h-5 text-blue-500" />}
                  label="Full Name"
                  name="name"
                  value={isEditing ? formData?.name : userData?.name}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                />

                <InfoField
                  icon={<Mail className="w-5 h-5 text-green-500" />}
                  label="Username"
                  name="username"
                  value={isEditing ? formData?.username : userData?.username}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                />

                <InfoField
                  icon={<Calendar className="w-5 h-5 text-orange-500" />}
                  label="Age"
                  name="age"
                  type="number"
                  value={isEditing ? formData?.age : userData?.age}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  error={errors.age}
                />

                <InfoField
                  icon={<Phone className="w-5 h-5 text-purple-500" />}
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={isEditing ? formData?.phoneNumber : userData?.phoneNumber}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit phone number"
                  error={errors.phoneNumber}
                />

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-gray-100">
                  <ReadOnlyField
                    icon={<Building2 className="w-5 h-5 text-cyan-500" />}
                    label="Department"
                    value={userData?.department}
                  />
                  <ReadOnlyField
                    icon={<Briefcase className="w-5 h-5 text-indigo-500" />}
                    label="Job Role"
                    value={userData?.jobRole}
                  />
                </div>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-gray-800">Account Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {userData?.createdAt
                        ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {userData?.updatedAt
                        ? new Date(userData.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
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
            getPasswordStrength={getPasswordStrength}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Quick Info Item
const QuickInfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-800 truncate">{value || 'Not set'}</p>
    </div>
  </div>
);

// Read-only Field
const ReadOnlyField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
    <div className="mt-0.5">{icon}</div>
    <div className="flex-1">
      <label className="text-xs text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <p className="font-medium text-gray-800 mt-0.5">{value || 'Not set'}</p>
    </div>
  </div>
);

// Info Field Component
const InfoField = ({
  icon,
  label,
  name,
  type = 'text',
  value,
  isEditing,
  onChange,
  disabled = false,
  placeholder,
  error,
  required,
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1">
        {label}
        {required && isEditing && <span className="text-red-500">*</span>}
      </label>
      {isEditing && !disabled ? (
        <>
          {type === 'textarea' ? (
            <textarea
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              rows="2"
              className={`w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all resize-none ${
                error
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
              }`}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              className={`w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                error
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
              }`}
            />
          )}
          {error && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
          )}
        </>
      ) : (
        <p className="font-medium text-gray-800 mt-1">
          {value || <span className="text-gray-400 italic">Not set</span>}
        </p>
      )}
    </div>
  </div>
);

// Password Change Modal
const PasswordChangeModal = ({
  passwordData,
  setPasswordData,
  showPasswords,
  setShowPasswords,
  onClose,
  onSubmit,
  getPasswordStrength,
}) => {
  const strength = getPasswordStrength(passwordData.newPassword);
  const passwordsMatch =
    passwordData.newPassword &&
    passwordData.confirmPassword &&
    passwordData.newPassword === passwordData.confirmPassword;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
            <p className="text-xs text-gray-500">Keep your account secure</p>
          </div>
        </div>

        <div className="space-y-4">
          {['current', 'new', 'confirm'].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {field === 'current'
                  ? 'Current Password'
                  : field === 'new'
                  ? 'New Password'
                  : 'Confirm Password'}
              </label>
              <div className="relative">
                <input
                  type={showPasswords[field] ? 'text' : 'password'}
                  value={passwordData[field + 'Password']}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      [field + 'Password']: e.target.value,
                    }))
                  }
                  placeholder={`Enter ${field} password`}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      [field]: !prev[field],
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords[field] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {field === 'new' && passwordData.newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= strength.score ? strength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Strength:{' '}
                    <span className="font-medium">{strength.label}</span>
                  </p>
                </div>
              )}

              {/* Password match indicator */}
              {field === 'confirm' && passwordData.confirmPassword && (
                <p
                  className={`text-xs mt-1 flex items-center gap-1 ${
                    passwordsMatch ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!passwordsMatch || !passwordData.currentPassword}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium transition-all shadow-md shadow-blue-500/30"
          >
            Update Password
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Skeleton
const ProfileSkeleton = () => (
  <div className="max-w-6xl mx-auto p-4 md:p-6">
    <div className="h-8 bg-gray-200 rounded-lg w-32 mb-2 animate-pulse" />
    <div className="h-4 bg-gray-200 rounded-lg w-48 mb-6 animate-pulse" />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="w-28 h-28 rounded-full bg-gray-200 mx-auto animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-lg w-32 mx-auto mt-4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-lg w-24 mx-auto mt-2 animate-pulse" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="mb-4">
            <div className="h-3 bg-gray-200 rounded-lg w-20 mb-2 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);