import express from 'express';
import authControllers from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  forgotPassword,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  sendOtpValidator,
  verifyOtpValidor,
} from '../validators/auth.validator.js';
const authRoute = express.Router();

// all routes
authRoute.post(
  '/register',
  registerValidator,
  validate,
  authControllers.registerController,
);
authRoute.post(
  '/login',
  protect,
  loginValidator,
  validate,
  authControllers.loginController,
);
authRoute.get('/verify-email/:token', authControllers.verifyEmailController);
authRoute.post(
  '/send-otp',
  sendOtpValidator,
  validate,
  authControllers.sendOtpController,
);
authRoute.post(
  '/verify-otp',
  verifyOtpValidor,
  validate,
  authControllers.verifyOtpController,
);
authRoute.post(
  '/forgot-password',
  forgotPassword,
  validate,
  authControllers.forgotPasswordController,
);
authRoute.post(
  '/reset-password',
  resetPasswordValidator,
  validate,
  authControllers.resetPasswordController,
);

authRoute.post('/logout', protect, authControllers.logoutController);

// only logged in user can access this page
authRoute.get('/profile', protect, authControllers.getProfileController);

// update login user profile
authRoute.patch(
  '/update-profile',
  protect,
  authControllers.updateUserProfileController,
);

// delete login user profile
authRoute.delete('/delete', protect, authControllers.deleteUserController);

export default authRoute;
