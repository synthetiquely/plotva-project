const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/', storage });

const userControllers = require('../controllers/user');
const { authenticateUser } = require('../middleware/authenticate');
const router = express.Router();

router.post('/', authenticateUser, upload.single('avatar'), userControllers.profileImage);

module.exports = router;
