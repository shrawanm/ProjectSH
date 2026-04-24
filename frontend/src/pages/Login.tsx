import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'; 
import { TopNotification } from '../components/TopNotification';
import { useGoogleLogin } from '@react-oauth/google';

export function Login() {
  const { login, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
// field states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const [notif, setNotif] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'error' });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotif({ show: true, message, type });
    setTimeout(() => setNotif(n => ({ ...n, show: false })), 3000);
  };

  const handleRedirect = (userEmail: string) => {
    localStorage.setItem('userEmail', userEmail);
        const destination = location.state?.from || '/';
    showNotification('Welcome back!', 'success');
    setTimeout(() => navigate(destination, { replace: true }), 800);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const gUser = await res.json();
        
        await googleLogin(gUser.name, gUser.email, gUser.sub, gUser.picture);
        
        //pass google email to redirect helper
        handleRedirect(gUser.email);
      } catch (err: any) {
        showNotification(err.message, 'error');
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
      
      // Pass the manual login email to the redirect helper
      handleRedirect(email);
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
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-text-secondary">Password</label>
              <Link to="/forgot-password" university-link="true" className="text-xs text-accent hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="input-field pl-10 pr-10" 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
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
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google Logo" />
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