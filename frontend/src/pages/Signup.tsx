import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TopNotification } from '../components/TopNotification';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [notif, setNotif] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotif({ show: true, message, type });
    setTimeout(() => setNotif(n => ({ ...n, show: false })), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showNotification('All fields are required', 'error');
      return;
    }

    if (!emailRegex.test(email)) {
      showNotification('Invalid email format', 'error');
      return;
    }

    if (password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      await signup(name, email, password);
      showNotification('Account created successfully', 'success');
      setTimeout(() => navigate('/'), 1800);
    } catch (err: any) {
      // Any server-side error,email already exists
      showNotification(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-bg-light dark:bg-bg-dark px-4 relative">
      {/* Notification positioned over the card */}
      <TopNotification
        show={notif.show}
        message={notif.message}
        type={notif.type}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-bg-card p-8 rounded-xl shadow-xl relative"
      >
        <h1 className="text-3xl font-serif font-bold text-center mb-2">
          Create Account
        </h1>
        <p className="text-center text-text-secondary mb-6">
          Join our community
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field pl-10"
                placeholder="Shrawan Mainali"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="shrawan@gmail.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-medium">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
