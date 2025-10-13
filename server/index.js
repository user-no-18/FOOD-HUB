import express from 'express';  
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(cookieParser())
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
