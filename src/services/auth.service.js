import User from '../models/User.model.js';
import sendVerificationEmail from '../utils/email.util.js';
import { generateSecureToken, getTokenExpire } from '../utils/otp.utils.js';

const registerService = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  // if user exists
  if (existingUser) {
    throw new Error('User already exists with this email!');
  }

  // verification token
  const verificationToken = generateSecureToken();
  const verificationExpire = getTokenExpire(24); // 24 hours

  // create user
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    emailVerificationToken: verificationToken,
    emailVerificationExpire: verificationExpire,
  });

  // send email
  await sendVerificationEmail(newUser.email, newUser.name, verificationToken);
  return newUser;
};

const loginService = async (userData) => {
  const user = await User.findOne({ email: userData.email }).select(
    '+password',
  );
  return user;
};

// otp send
const sendOtpService = async ({ email }) => {
  const user = await User.findOne({ email });
  // if not account found
  if (!user) {
    const error = new Error('No account found with this email!');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

// forgot passcode
const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });
  // validation
  if (!user) {
    throw new Error('If this email exists, a reset link has been sent!');
  }
  return user;
};

// update data
const updateUserProfileService = async (userId, updateData) => {
  // find user
  const user = await User.findById(userId);
  // if user not here
  if (!user) {
    throw new Error('User not found!');
  }

  // allowed update formates
  const allowedUpdate = ['name', 'email', 'password', 'phone', 'avatar'];
  // extract all keys from request body
  const incomingUpdates = Object.keys(updateData);

  // loop for update
  incomingUpdates.forEach((field) => {
    if (allowedUpdate.includes(field) && updateData[field]) {
      user[field] = updateData[field];
    }
  });

  // save on database
  const savedUser = await user.save();
  // delete password from security perpouse
  const result = savedUser.toObject();
  delete result.password;
  return result;
};

const deleteUserService = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  // validation
  if (!deletedUser) {
    throw new Error('User not found!');
  }

  return deletedUser;
};

const authServices = {
  registerService,
  loginService,
  sendOtpService,
  forgotPasswordService,
  deleteUserService,
  updateUserProfileService,
};

export default authServices;
