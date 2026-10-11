import cookieOptions from '../config/cookie.config.js';
import User from '../models/User.model.js';
import authServices from '../services/auth.service.js';
import { sendOtpEmail, sendResetPassEmail } from '../utils/email.util.js';
import { generateToken } from '../utils/jwt.util.js';
import {
  generateOTP,
  generateSecureToken,
  getOtpExpiry,
  getTokenExpire,
} from '../utils/otp.utils.js';

const registerController = async (req, res) => {
  try {
    const userData = req.body;

    // call ther service
    const user = await authServices.registerService(userData);

    // jwt token
    const token = generateToken(user._id);

    // success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email!',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // call the service
    const user = await authServices.loginService({ email });

    // if user not found and user passcode dosen't match
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials!' });
    }

    // if user not actice
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated!',
      });
    }

    // JWT
    const token = generateToken(user._id);
    // success response with cookie
    res
      .cookie('token', token, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: 'User logged in successfully!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpire: { $gt: Date.now() },
    });

    // if user not here
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expire verification link!',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpire = null;

    // now save on db
    await user.save();
    // success response
    res.status(200).json({
      success: true,
      message: 'Email verified successfully. Now, you can login!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

// otp send
const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    // call the service
    const user = await authServices.sendOtpService({ email });

    // generate the 6 digit otp
    const otp = generateOTP();
    const otpExpire = getOtpExpiry();

    user.otp = otp;
    user.otpExpire = otpExpire;

    // now save
    await user.save();

    // send otp email
    await sendOtpEmail(email, user.name, otp);

    // success response
    res.status(200).json({
      success: true,
      message: `OTP sent to your email ${email}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() },
    });
    // validation
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expire OTP!' });
    }

    user.otp = null;
    user.otpExpire = null;
    user.isEmailVerified = true;

    // save user
    await user.save();

    // generate token
    const token = generateToken(user._id);

    // success response
    res
      .status(200)
      .json({ success: true, message: 'OTP verified successfully!', token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

// forgot passcode
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // call the service
    const user = await authServices.forgotPasswordService({ email });

    // generate reset token
    const resetToken = generateSecureToken();

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = getTokenExpire(0.25);

    // now save the data
    await user.save();

    // now sent reset passcode email
    await sendResetPassEmail(email, user.name, resetToken);

    // success response
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    // validation
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid or expire token!' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    // now save the data
    await user.save();
    // success response
    res.status(200).json({
      success: false,
      message: 'Password reset successfully. You can login now!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

const logoutController = async (req, res) => {
  try {
    // clear the cookie
    res.clearCookie('token', cookieOptions);

    // Extra security: Instructing to clear the session cache in the response header. Doing this will prevent old data from being displayed when you press the browser's 'Back' button
    res.setHeader('Clear-Site-Data', '"cookies", "storage", "cache"');

    // success response
    res.status(200).json({
      success: true,
      message: 'User successfully logged out and session cleared!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

const getProfileController = async (req, res) => {
  try {
    const user = req.user;

    // success response
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

const updateUserProfileController = async (req, res) => {
  try {
    // userId from middleware(protect)
    const userId = req.user._id;

    // getting data from request body
    const { name, email, password, phone, avatar } = req.body;

    // call the service
    const updateUser = await authServices.updateUserProfileService(userId, {
      name,
      email,
      password,
      phone,
      avatar,
    });

    // if user exists
    if (!updateUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found!' });
    }

    // success response
    res.status(200).json({
      success: true,
      message: `${updateUser.name}'s profile updated successfully!`,
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    // user id from protect middleware
    const userId = req.user._id;

    // call the service
    await authServices.deleteUserService(userId);

    // clear the cookie from browser and success response
    res.clearCookie('token', cookieOptions).status(200).json({
      success: true,
      message: 'User deleted successfully and logged out!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error!',
    });
  }
};

const authControllers = {
  registerController,
  loginController,
  verifyEmailController,
  sendOtpController,
  verifyOtpController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  getProfileController,
  deleteUserController,
  updateUserProfileController,
};

export default authControllers;
