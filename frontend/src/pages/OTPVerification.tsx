import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
export function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.every(digit => digit !== '')) {
      navigate('/reset-password');
    }
  };
  return <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-bg-light dark:bg-bg-dark px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-weave opacity-5 pointer-events-none"></div>

      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="w-full max-w-md bg-bg-card dark:bg-bg-card p-8 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-text-primary mb-2">
            Verify Email
          </h1>
          <p className="text-text-secondary">
            We've sent a 6-digit code to <br />
            <span className="font-medium text-text-primary">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => <input key={index} ref={el => inputRefs.current[index] = el} type="text" maxLength={1} value={digit} onChange={e => handleChange(index, e.target.value)} onKeyDown={e => handleKeyDown(index, e)} className="w-12 h-14 text-center text-xl font-bold rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all" />)}
          </div>

          <button type="submit" className="w-full btn-primary">
            Verify Code
          </button>

          <p className="text-center text-sm text-text-secondary">
            Didn't receive the code?{' '}
            <button type="button" className="font-medium text-accent hover:text-accent-hover">
              Resend OTP
            </button>
          </p>
        </form>
      </motion.div>
    </div>;
}