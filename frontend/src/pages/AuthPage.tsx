import React, { useState } from 'react';
import { Leaf, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword, validateName } from '../utils/validators';

const AuthPage: React.FC = () => {
  const { signIn, signUp, isLoading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    setFormErrors({ ...formErrors, [field]: '' });
  };

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      password: ''
    };

    if (!isLogin) {
      errors.name = validateName(formData.name) || '';
    }
    errors.email = validateEmail(formData.email) || '';
    errors.password = validatePassword(formData.password) || '';

    setFormErrors(errors);
    return !errors.email && !errors.password && (isLogin || !errors.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await signIn({
          email: formData.email,
          password: formData.password
        });
      } else {
        await signUp({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
    } catch (err) {
      // Error is handled by the hook
      console.error('Auth error:', err);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormErrors({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 relative overflow-hidden">
      {/* Abstract Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-100/50 rounded-full blur-3xl" />
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-stone-200 overflow-hidden relative z-10 m-4">
        {/* Brand Side */}
        <div className="bg-emerald-700 p-12 flex flex-col justify-between text-white relative">
          <div className="absolute inset-0 opacity-10 flex items-center justify-center">
            <Leaf size={400} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <Leaf size={32} className="text-emerald-300" />
              <span className="text-2xl font-bold tracking-tight">Crop Yield Predictor</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">Precision farming for a prosperous future.</h1>
            <p className="text-emerald-100 leading-relaxed">
              Join thousands of Ghanaian farmers using data science to maximize their maize yields and grow sustainable businesses.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-4 text-emerald-200 text-sm">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <img 
                  key={i} 
                  src={`https://picsum.photos/seed/${i}/40/40`} 
                  className="w-8 h-8 rounded-full border-2 border-emerald-700" 
                  alt="Farmer" 
                />
              ))}
            </div>
            <span>Trusted by 5k+ local farmers</span>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-12">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-stone-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-stone-500">
              {isLogin ? 'Sign in to access your dashboard.' : 'Start your precision farming journey today.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Kwame Mensah"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full bg-stone-50 border rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all ${
                      formErrors.name ? 'border-red-500' : 'border-stone-200'
                    }`}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-xs text-red-600 ml-1">{formErrors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="kwame@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full bg-stone-50 border rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all ${
                    formErrors.email ? 'border-red-500' : 'border-stone-200'
                  }`}
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-red-600 ml-1">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full bg-stone-50 border rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all ${
                    formErrors.password ? 'border-red-500' : 'border-stone-200'
                  }`}
                />
              </div>
              {formErrors.password && (
                <p className="text-xs text-red-600 ml-1">{formErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-stone-100 text-center">
            <button
              onClick={toggleMode}
              className="text-stone-500 text-sm hover:text-emerald-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;