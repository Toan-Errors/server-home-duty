const express = require('express');
const router = express.Router();

const {
  create,
  remove,
  update,
  addMember,
  removeMember,
  getGroups,
  getGroup,
} = require('../controllers/group.controller');

const { isAuth } = require('../middleware/auth.middleware');

router.get('/', isAuth, getGroups);
router.get('/:id', isAuth, getGroup);
router.post('/', isAuth, create);
router.delete('/:id', isAuth, remove);
router.put('/:id', isAuth, update);
router.post('/:id/members', isAuth, addMember);
router.delete('/:id/members', isAuth, removeMember);

module.exports = router;