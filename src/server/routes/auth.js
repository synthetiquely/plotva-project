const express = require('express');
const authControllers = require('../controllers/auth');

const router = express.Router();

router.get('/', authControllers.cookie);
router.get('/signout', authControllers.signout);

router.post('/signin', authControllers.signin);
router.post('/signup', authControllers.signup);

module.exports = router;
