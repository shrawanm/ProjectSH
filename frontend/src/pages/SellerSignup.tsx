import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TopNotification } from '../components/TopNotification';

export function SellerSignup() {
  const { sellerSignup, user, logout } = useAuth();
  const navigate = useNavigate();

  // If already logged in as customer, show confirmation
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect(() => {
    if (user && user.role === 'user') {
      setShowConfirmLogout(true);
    } else if (user && user.role === 'seller') {
      navigate('/seller-dashboard');
    }
  }, [user, navigate]);

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [shop_name, setShop_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [notif, setNotif] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'error' });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotif({ show: true, message, type });
    setTimeout(() => setNotif(n => ({ ...n, show: false })), 3000);
  };

  const validateForm = () => {
    if (shop_name.trim().length < 2) {
      showNotification('Please enter a valid shop name (min 2 characters)', 'error');
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      showNotification('Please enter a valid email address', 'error');
      return false;
    }
    if (password.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return false;
    }
    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await sellerSignup(shop_name, email, password);
      showNotification('Seller account created successfully!', 'success');
      setTimeout(() => navigate('/seller-dashboard'), 800);
    } catch (err: any) {
      showNotification(err.message || 'Signup failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center px-4 py-8">
      <TopNotification {...notif} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        {showConfirmLogout && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-3">
              {/* You are currently logged in as a customer create a separate seller account using a different email*/}
            </p>
            <button
              onClick={() => {
                logout();
                setShowConfirmLogout(false);
                showNotification('Logged out. You can now sign up as a seller with a different email.', 'success');
              }}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Logout & Continue as Seller
            </button>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
            <Store className="text-emerald-600" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sell Your Products</h1>
          <p className="text-gray-600 mt-2">Create your seller account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shop Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
            <input
              type="text"
              value={shop_name}
              onChange={(e) => setShop_name(e.target.value)}
              placeholder="Your shop name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
              disabled={isLoading}
            />
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? 'Creating Account...' : 'Create Seller Account'}
          </motion.button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have a seller account?{' '}
          <Link to="/seller-login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Log in
          </Link>
        </p>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Looking to shop?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
            Create buyer account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
