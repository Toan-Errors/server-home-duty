const express = require('express');
const router = express.Router();

require('../utils/db');

router.get('/', (req, res) => {
  res.send('Hello V1!');
});

router.use('/auth', require('./routes/auth.routes'));
router.use('/groups', require('./routes/group.routes'));
router.use('/users', require('./routes/user.routes'));
router.use('/invitations', require('./routes/invitation.routes'));

module.exports = router;