const User = require('../models/user.model');
const Invitation = require('../models/invitation.model');

const userController = {
  findUserByName: async (req, res) => {
    if (!req.query.name) return res.status(400).json([])
    const name = req.query.name.trim();
    const group = req.query.group;
    const { sub: sender } = req.user;
    try {
      const usersQuery = {
        "$or": [
          { name: { "$regex": name, "$options": "i" } },
          // { email: { "$regex": req.query.name, "$options": "i" } }
        ],
      };

      const [users, invitations] = await Promise.all([
        User.find(usersQuery).lean(),
        Invitation.find({
          sender,
          group,
        }).lean()
      ]);

      if (users.length === 0) {
        return res.status(404).json([]);
      }

      const usersWithInvitation = users.map(user => {
        if (invitations.length === 0) {
          return {
            ...user,
            invitationStatuses: []
          };
        }
        const userInvitations = invitations.filter(invitation => invitation.receiver.toString() === user._id.toString());
        const invitationStatuses = userInvitations.map(invitation => ({
          invitationId: invitation._id,
          status: invitation.status
        }));

        if (invitationStatuses.length > 0) {
          return {
            ...user,
            invitationStatuses: invitationStatuses || []
          };
        }

        return user;
      });

      res.status(200).json(usersWithInvitation);
    } catch (error) {
      res.status(500).json([]);
    }
  }
};

module.exports = userController;