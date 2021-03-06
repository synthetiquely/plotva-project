const express = require('express');
const multer = require('multer');
const userControllers = require('../controllers/user');
const { authenticateUser } = require('../middleware/authenticate');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, size: 2 * 1024 * 1024 });

router.post(
  '/avatar',
  authenticateUser,
  upload.single('avatar'),
  userControllers.updateAvatar,
);
router.post('/profile', authenticateUser, userControllers.updateProfile);

module.exports = router;
