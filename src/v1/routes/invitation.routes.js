const {
  sendInvitation,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  getInvitations,
  getInvitation,
  getInvitationByGroup,
} = require('../controllers/invitation.controller');
const router = require('express').Router();

const { isAuth } = require('../middleware/auth.middleware');

router.post('/', isAuth, sendInvitation);
router.get('/', isAuth, getInvitations);
router.get('/:id', isAuth, getInvitation);
router.get('/group/:id', isAuth, getInvitationByGroup);
router.put('/accept', isAuth, acceptInvitation);
router.put('/reject', isAuth, rejectInvitation);
router.put('/cancel', isAuth, cancelInvitation);

module.exports = router;