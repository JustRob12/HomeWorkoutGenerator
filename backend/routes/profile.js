import express from 'express';
import multer from 'multer';
import path from 'path';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: 'uploads/avatars/',
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
}).single('avatar');

// Update profile picture
router.post('/upload-avatar', auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    try {
      const user = await User.findById(req.user.userId);
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();

      res.json({ 
        message: 'Profile picture updated successfully',
        avatar: user.avatar
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 