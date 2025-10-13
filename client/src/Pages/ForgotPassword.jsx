import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {serverUrl} from "../App";
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const primaryColor = "#ff4d2d"; // rich orange
  const hoverColor = "#e64323"; // darker orange
  const bgColor = "#fff9f6"; // light off-white background
  const borderColor = "#ddd";
  const [err,setErr] = useState('');
  const navigate = useNavigate();

const handleSendOtp = async () => {
      try {
        const result = await axios.post(`${serverUrl}/api/auth/send-otp`, {email},
        { withCredentials: true }
        );
        console.log("otp sent", result.data);
        setStep(2);
      } catch (error) {
        setErr("Enter Valid email")
        console.error("Error sending OTP:", error.message);
      }
    };
const handleVerifyOtp = async () => {
      try {
        const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, {email, otp},
        { withCredentials: true }
        );
        console.log("otp verified", result.data);
        setStep(3);
      } catch (error) {
        setErr("Cannot verify otp")
        console.error("Error verifying OTP:", error.message);
      }
    };
const handleResetPassword = async () => {
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        const result = await axios.post(`${serverUrl}/api/auth/reset-password`, {email, newPassword},
        { withCredentials: true } 
        );
        console.log("password reset", result.data);
        alert("Password reset successful. Please sign in with your new password.");
        navigate("/signin");
      } catch (error) {
        setErr("Error resetting password:", error.message)
        console.error("Error resetting password:", error.message);
      } 
    };
   


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        {/* Heading */}
         <h1
          className="text-3xl font-bold mb-2 text-center"
          style={{ color: primaryColor }}
        >
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Follow the steps to reset your password
        </p>
        {/* Step 1: Email */}
         {step === 1 && (
          <>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-orange-500"
              style={{ borderColor: borderColor }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200"
              style={{ backgroundColor: primaryColor, color: "white" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = primaryColor)
              }
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
             {err && <p className="text-center text-red-600">{err}</p>}
          </>
        )}
        {/* Step 2: OTP */}
              {step === 2 && (
          <>
            <label className="block text-gray-700 font-medium mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="Enter the OTP sent to your email"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-orange-500"
              style={{ borderColor: borderColor }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200"
              style={{ backgroundColor: primaryColor, color: "white" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = primaryColor)
              }
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
             {err && <p className="text-center text-red-600">{err}</p>}
          </>
        )}
        {/* Step 3: New Password */}
        {step === 3 && (
          <>
            <label className="block text-gray-700 font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-orange-500"
              style={{ borderColor: borderColor }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label className="block text-gray-700 font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-orange-500"
              style={{ borderColor: borderColor }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200"
              style={{ backgroundColor: primaryColor, color: "white" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = hoverColor)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = primaryColor)
              }
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
             {err && <p className="text-center text-red-600">{err}</p>}
          </>
        )}
         {/* Back to Sign In Link */}
          <p className="mt-6 text-center text-gray-600">
          Remember your password?{" "}
          <Link
            to="/signin"
            className="font-semibold"
            style={{ color: primaryColor }}
          >
            Back to Login
          </Link>
        </p>
      </div>
      
    </div>
  );
};

export default ForgotPassword;
