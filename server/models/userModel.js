import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },  
    email: {
        type: String,
        required: true,
        unique: true,

        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
    },
    password: {
        type: String,
       
    },
    mobile:{
        type: String,
        required: true,
       
    },
    role: {
        type: String,
        enum: ['user', 'owner', 'deliveryBoy'],
        default: 'user',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetOtp:{
        type: String,
    },
    isOtpVerified:{
        type: Boolean,
        default: false,
    },
    otpExpires:{
        type: Date,
    }
},{ timestamps: true });
 
const User = mongoose.model('User', userSchema);

export default User;