import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux';
import { setUserData } from '../Redux/user.slice';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../Firebase';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const handleSignIn = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(data))
      setLoading(false)
      console.log("sign in success", data)
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  };

  const handleGoogleAuth = async () => { 
    setErr("")
    try {
      if(!mobile) return setErr("Please enter your mobile number to continue with Google sign up.");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google User:", result.user);
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobile,
          role: "user",
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data))
      console.log("Backend Response:", data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: bgColor }}>
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8" style={{ border: `1px solid ${borderColor}` }}>
          <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>Vingo</h1>
          <p className="text-gray-600 mb-8">Welcome back! Please sign in to continue enjoying delicious food deliveries.</p>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              style={{ borderColor: borderColor }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Mobile</label>
            <input
              type="text"
              placeholder="Enter your mobile number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              style={{ borderColor: borderColor }}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-orange-500"
                style={{ borderColor: borderColor }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right mb-4">
            <Link to="/forgotpassword" style={{ color: primaryColor }} className="text-sm font-medium hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            className="w-full font-semibold py-2 rounded-lg transition duration-200"
            style={{ backgroundColor: primaryColor, color: "white" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20}/> : "Sign In"}
          </button>

          <button
            className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200"
            style={{ borderColor: borderColor }}
            onClick={handleGoogleAuth}
          >
            <FcGoogle size={20} />
            <span className="font-medium text-gray-700">Sign in with Google</span>
          </button>

          {err && <p className="text-red-500 mt-2">{err}</p>}

          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-semibold" style={{ color: primaryColor }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
