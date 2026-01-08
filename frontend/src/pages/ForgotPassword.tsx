import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    try {
      const res = await fetch(
        "http://localhost/ShrawanHandicraftsFYP/backend/api/request-otp.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send OTP");
        return;
      }

      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error(err);
      alert("Server error try again.");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-bg-light dark:bg-bg-dark px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-bg-card p-8 rounded-lg shadow-xl"
      >
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-text-secondary mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Login
        </Link>

        <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
        <p className="mb-6">Enter your email to receive OTP</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="you@example.com"
              required
            />
          </div>

          <button type="submit" className="w-full btn-primary">
            Send OTP
          </button>
        </form>
      </motion.div>
    </div>
  );
}
