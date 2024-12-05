import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { username }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google OAuth route
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with same email
      user = await User.findOne({ email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        if (!user.avatar && avatar) user.avatar = avatar;
        await user.save();
      } else {
        // Create new user
        user = new User({
          username: name.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).slice(-4),
          email,
          googleId,
          avatar,
          password: Math.random().toString(36).slice(-8)
        });
        await user.save();
      }
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Facebook OAuth route
router.post('/facebook', async (req, res) => {
  try {
    const { facebookId, email, name, avatar } = req.body;

    let user = await User.findOne({ facebookId });

    if (!user) {
      // Check if user exists with same email
      user = await User.findOne({ email });
      
      if (user) {
        // Link Facebook account to existing user
        user.facebookId = facebookId;
        if (!user.avatar && avatar) user.avatar = avatar;
        await user.save();
      } else {
        // Create new user
        user = new User({
          username: name.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).slice(-4),
          email,
          facebookId,
          avatar,
          password: Math.random().toString(36).slice(-8)
        });
        await user.save();
      }
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Facebook auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
