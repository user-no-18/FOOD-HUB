
import express from 'express';
import { signIn,signOut,signUp,sendOtp,verifyOtp,resetPassword, googleAuth } from '../controllers/authController.js'; 

const authrouter = express.Router();

authrouter.post('/signup', signUp);
authrouter.post('/signin', signIn);
authrouter.post('/signout', signOut);
authrouter.post('/send-otp', sendOtp);
authrouter.post('/verify-otp', verifyOtp);
authrouter.post('/reset-password', resetPassword);
authrouter.post('/google-auth',googleAuth)
export default authrouter;
