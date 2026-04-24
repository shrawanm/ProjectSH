import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); 
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const mode = location.state?.mode || "forgot-password";

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = otp.join("");
    if (code.length !== 6) return;

    try {
      // Use different endpoint based on mode
      const endpoint = mode === "registration" 
        ? "http://localhost/ShrawanHandicraftsFYP/backend/api/verify-registration-otp.php"
        : "http://localhost/ShrawanHandicraftsFYP/backend/api/verify-otp.php"; //reset

        //then sends to backend verify-otp.php
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Invalid OTP");
        return;
      }

      // If registration mode, auto login
      if (mode === "registration") {
        const newUser = {
          id: data.user_id,
          name: location.state?.name || "",
          email: email,
          avatar: null,
          role: "user" as const
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        window.location.href = "/";
      } else {
        
        // Forgot password page
        navigate("/reset-password", {
          state: { userId: data.user_id },
        });
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div className="p-8 bg-bg-card rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">
          {mode === "registration" ? "Verify Email" : "Verify OTP"}
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          {mode === "registration" 
            ? "We've sent an OTP to your email. Enter it below to complete registration."
            : "Enter the OTP sent to your email"}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-6 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-12 h-12 text-center text-xl border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            ))}
          </div>

          <button className="w-full btn-primary">
            {mode === "registration" ? "Complete Registration" : "Verify OTP"}
          </button>
        </form>

        <p className="text-center text-xs text-text-secondary mt-4">
          OTP valid for 5 minutes
        </p>
      </motion.div>
    </div>
  );
}
