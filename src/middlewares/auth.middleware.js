import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

// create an protect middleware for extra security
export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // if token not here
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Not authorized, token not found!', success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    // if the token is correct but that user is deleted from database
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: 'User no longer exists!' });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Token is invalid or expired!', success: false });
  }
};
