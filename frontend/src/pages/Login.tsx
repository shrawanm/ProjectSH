import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { TopNotification } from '../components/TopNotification';
import { useGoogleLogin } from '@react-oauth/google';

export function Login() {
  const { login, googleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [notif, setNotif] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'error' });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotif({ show: true, message, type });
    setTimeout(() => setNotif(n => ({ ...n, show: false })), 3000);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const gUser = await res.json();
        await googleLogin(gUser.name, gUser.email, gUser.sub, gUser.picture);

        showNotification('Welcome back!', 'success');
        setTimeout(() => navigate('/'), 800);
      } catch (err: any) {
        showNotification(err.message, 'error');
        // If user doesn't exist, redirect to signup
        if (err.message.includes("sign up")) {
          setTimeout(() => navigate('/signup'), 2500);
        }
      }
    },
    onError: () => showNotification('Google login failed', 'error'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    try {
      await login(email, password);
      showNotification('Logged in successfully', 'success');
      setTimeout(() => navigate('/'), 800);
    } catch (err: any) {
      showNotification(err.message || 'Invalid credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-bg-light dark:bg-bg-dark px-4 relative overflow-hidden">
      <TopNotification show={notif.show} message={notif.message} type={notif.type} />
      <div className="absolute inset-0 bg-pattern-weave opacity-5 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-bg-card p-8 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-text-primary mb-2">Welcome Back</h1>
          <p className="text-text-secondary">Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-text-secondary">Password</label>
              <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-10" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center items-center">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-bg-card text-text-muted">Or continue with</span></div>
          </div>

          <button type="button" onClick={() => handleGoogleLogin()} className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-text-secondary font-medium">Google</span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Don't have an account? <Link to="/signup" className="font-medium text-accent hover:text-accent-hover">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}