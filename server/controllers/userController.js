import User from "../models/userModel.js";

// Controller function to fetch the current user's data
export const getCurrentUser = async (req, res) => {
    try {
        // req.userId is set by the isAuth middleware
        const user = await User.findById(req.userId).select('-password'); 
        console.log("Type of userId:", typeof req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found in database." });
        }

        // Send the user data back to the frontend
        return res.status(200).json({ 
            success: true, 
            user: user 
        });

    } catch (error) {
        console.error("Error in getCurrentUser:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};