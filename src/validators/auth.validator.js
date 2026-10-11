import { body } from 'express-validator';

const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2-50 characters!'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Please enter a valid email!'),

  body('password')
    .notEmpty()
    .withMessage('Password is requied!')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters!')
    .matches(/\d/)
    .withMessage('Password must contain at least one number!'),
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Please enter a valid email!'),

  body('password').notEmpty().withMessage('Password is required!'),
];

const sendOtpValidator = [
  body('email').isEmail().withMessage('Please enter a valid email!'),
];

const verifyOtpValidor = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Please enter a valid email!'),

  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required!')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits!')
    .isNumeric()
    .withMessage('OTP must be numeric!'),
];

const forgotPassword = [
  body('email').isEmail().withMessage('Please enter a valid email!'),
];

const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required!'),

  body('password')
    .notEmpty()
    .withMessage('Password is required!')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters!')
    .matches(/\d/)
    .withMessage('Password must contain at least one number!'),
];

export {
  forgotPassword,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  sendOtpValidator,
  verifyOtpValidor,
};
