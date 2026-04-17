import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token.js";
import { sendOTPMail } from "../utils/mail.js";

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email and password are required" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });

    if (mobile) {
      const mobileStr = String(mobile);
      if (mobileStr.length !== 10)
        return res
          .status(400)
          .json({ message: "Mobile number must be 10 digits long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      mobile: mobile ? String(mobile) : undefined,
      role,
    });

    await newUser.save();

    const token = generateToken(newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const signOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Signed out successfully" });
};

//this function will generate otp and send to user email by calling sendOTPMail function from mail.js
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body; 
    const user = await User.findOne({ email }); 
    if (!user) {
      console.log("User with this email does not exist");
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp; 
    user.otpExpires = Date.now() + 5 * 60 * 1000; 
    user.isOtpVerified = false; 
    await user.save();
    await sendOTPMail(email, otp);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "OTP not send", error: error.message });
  }
};
//otp verification
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.resetOtp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    //comparing otp
    if(otp !== user.resetOtp){
      return res.status(400).json({ message: "Invalid OTP" });
    }
    //
    user.isOtpVerified = true;
    user.resetOtp= undefined;
    user.otpExpires= undefined;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const resetPassword = async (req, res) => {
   try {
    const{email, newPassword} = req.body;
    const user = await User.findOne({ email });
    if(!user || !user.isOtpVerified){
      return res.status(400).json({ message: "Otp verification not done" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.isOtpVerified = false; 
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
   } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
   }
}

//this controller will handle google authentication
export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, role, mobile } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "fullName and email are required" });
    }

    let user = await User.findOne({ email });
    const isNewUser = !user;

    // if user already exists then no need to create new user
    if (!user) {
      user = await User.create({
        fullName,
        email,
        role,
        mobile,
      });
    }

    //generate token
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });

    // 201 for new user created, 200 for existing user signing in
    return res.status(isNewUser ? 201 : 200).json(user);
  } catch (error) {
    console.error("googleAuth error:", error);
    return res.status(500).json({ message: `signupwithgoogle error ${error.message}` });
  }
};