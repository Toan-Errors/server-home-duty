const {
  findUserByName
} = require('../controllers/user.controller');

const router = require('express').Router();
const { isAuth } = require('../middleware/auth.middleware');

router.get('/search', isAuth, findUserByName);

module.exports = router; // Path: src\v1\routes\user.routes.js