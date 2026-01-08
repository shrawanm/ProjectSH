import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword || password.length < 6) {
      alert("Passwords do not match or too short");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost/ShrawanHandicraftsFYP/backend/api/reset-password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, password }),
        }
      );

      if (!res.ok) {
        alert("Failed to reset password");
        return;
      }

      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div className="p-8 bg-bg-card rounded-lg shadow-xl">
        <h2 className="text-xl mb-4">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            required
          />

          <button className="btn-primary w-full">Reset</button>
        </form>
      </motion.div>
    </div>
  );
}
