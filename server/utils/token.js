import jwt from 'jsonwebtoken';


const generateToken = (userId) => {
 try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    return token;   
 } catch (error) {
   throw new Error('Could not generate token');
 }
};

export default generateToken;