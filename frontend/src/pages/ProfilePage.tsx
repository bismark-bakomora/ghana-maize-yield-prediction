import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save,
  Camera,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Calendar
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';

const ProfilePage: React.FC = () => {
  const { user, signOut, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Kofi Mensah',
    email: user?.email || 'kofi.mensah@email.com',
    phone: user?.phone || '+233 24 123 4567',
    location: user?.location || 'Ejura-Sekyedumase',
    farmSize: '15 acres'
  });

  const [notifications, setNotifications] = useState({
    predictions: true,
    weather: true,
    tips: false,
    newsletter: true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [showPasswordToast, setShowPasswordToast] = useState(false);

  const getInitials = () => {
    return profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Save updated profile
  const handleSave = async () => {
    try {
      if (updateProfile) {
        await updateProfile({
          name: profile.name,
          phone: profile.phone,
          location: profile.location
        });
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  // Change password handler
  const handleChangePassword = async () => {
    try {
      if (changePassword) {
        await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
        setPasswordForm({ currentPassword: '', newPassword: '' });
        setShowPasswordToast(true);
        setTimeout(() => setShowPasswordToast(false), 3000);
      }
    } catch (err) {
      console.error('Failed to change password', err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Toast Notifications */}
        {showToast && (
          <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-4">
            Profile updated successfully!
          </div>
        )}
        {showPasswordToast && (
          <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-4">
            Password changed successfully!
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-emerald-100">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-stone-900">Personal Information</h2>
                  <Button
                    variant={isEditing ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-stone-200">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-bold text-white">{getInitials()}</span>
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-emerald-600 text-emerald-600 flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-900">{profile.name}</h3>
                    <p className="text-stone-500">Farmer ID: GH-2024-{Math.floor(Math.random() * 9999)}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
                      <User className="w-4 h-4 text-stone-500" />
                      Full Name
                    </label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
                      <Mail className="w-4 h-4 text-stone-500" />
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profile.email}
                      disabled
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
                      <Phone className="w-4 h-4 text-stone-500" />
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
                      <MapPin className="w-4 h-4 text-stone-500" />
                      District
                    </label>
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-stone-700 mb-2 block">Farm Size</label>
                    <Input
                      value={profile.farmSize}
                      onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Change Password Form */}
                {isEditing && (
                  <div className="mt-6 border-t border-stone-200 pt-6">
                    <h3 className="text-lg font-bold text-stone-900 mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="password"
                        placeholder="Current Password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      />
                      <Input
                        type="password"
                        placeholder="New Password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      />
                      <Button
                        variant="primary"
                        onClick={handleChangePassword}
                        className="md:col-span-2"
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">Notifications</h2>
                    <p className="text-sm text-stone-500">Manage your notification preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "predictions", label: "Prediction Alerts", desc: "Get notified when your prediction is ready" },
                    { key: "weather", label: "Weather Alerts", desc: "Receive weather updates for your district" },
                    { key: "tips", label: "Farming Tips", desc: "Weekly tips and best practices" },
                    { key: "newsletter", label: "Newsletter", desc: "Monthly updates and news" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors">
                      <div>
                        <p className="font-semibold text-stone-900">{item.label}</p>
                        <p className="text-sm text-stone-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ 
                          ...notifications, 
                          [item.key]: !notifications[item.key as keyof typeof notifications] 
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications] 
                            ? 'bg-emerald-600' 
                            : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[item.key as keyof typeof notifications] 
                              ? 'translate-x-6' 
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Activity Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                <h3 className="font-bold text-stone-900 mb-4">Your Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Total Predictions</span>
                    <span className="font-bold text-stone-900 text-lg">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Member Since</span>
                    <span className="font-bold text-stone-900">Mar 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">PFJ Status</span>
                    <span className="px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <h3 className="font-bold text-stone-900 p-6 pb-4">Quick Links</h3>
                <div>
                  {[
                    { icon: Shield, label: "Security Settings", href: "#" },
                    { icon: Bell, label: "Notification History", href: "#" },
                  ].map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="flex items-center justify-between p-4 border-t border-stone-100 hover:bg-stone-50 transition-colors text-stone-700 hover:text-stone-900"
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </a>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between p-4 border-t border-stone-100 hover:bg-red-50 transition-colors text-red-600"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
                <h4 className="font-bold mb-2">Need Help?</h4>
                <p className="text-sm text-amber-50 mb-4">
                  Contact our support team for assistance with your account.
                </p>
                <button className="w-full bg-white text-amber-600 py-3 px-4 rounded-xl font-bold hover:bg-amber-50 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;