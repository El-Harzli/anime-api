import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const accessTokenExpirationTime = '15m';
const refreshTokenExpirationTime = '1d';
const refreshTokenMaxAge = 1 * 24 * 60 * 60 * 1000;

export const register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already used' });
    }
    // Check if email already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already used' });
    }

    // Check if password matches confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password!' });
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          _id: foundUser._id,
          username: foundUser.username,
          email: foundUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: accessTokenExpirationTime,
      }
    );

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          _id: foundUser._id,
          username: foundUser.username,
          email: foundUser.email,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: refreshTokenExpirationTime,
      }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: refreshTokenMaxAge,
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: { id: foundUser._id, username: foundUser.username, email: foundUser.email },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const foundUser = await User.findOne({ email: decoded.UserInfo.email });
    if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          _id: foundUser._id,
          username: foundUser.username,
          email: foundUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessTokenExpirationTime }
    );

    res.json({ accessToken, user: { username: foundUser.username, email: foundUser.email } });
  } catch (err) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite:  process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });
    return res.status(403).json({ message: 'Forbidden' });
  }
};

export const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return res.status(204).send();
  }
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
    secure: process.env.NODE_ENV === 'production' ? true : false,
  });

  return res.json({ message: 'Cookie cleared and logged out successfully' });
};

export const updatePassword = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: 'Unauthorized - no user data' });

    // Check if a user really exists
    const foundUser = await User.findOne({ _id: req.user._id });

    if (!foundUser) {
      return res.status(404).json({ message: 'No such user' });
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(currentPassword, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password not correct' });
    }

    // check if new password is the current password
    if (await bcrypt.compare(newPassword, foundUser.password)) {
      return res.status(400).json({ message: 'New password must be different from current password' });
    }

    // UPDATE USER PASSWORD
    const hashed = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashed;
    await foundUser.save();

    return res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
