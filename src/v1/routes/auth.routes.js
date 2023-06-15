const express = require('express');
const router = express.Router();

const { register, login, authenticate } = require('../controllers/auth.controller');
const { isAuth } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', isAuth, authenticate);

module.exports = router;