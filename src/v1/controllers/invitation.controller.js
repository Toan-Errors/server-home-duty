const Invitation = require('../models/invitation.model');
const Group = require('../models/group.model');
// const User = require('../models/user.model');

const invitationController = {
  sendInvitation: async (req, res) => {
    try {
      const { sub: sender } = req.user;
      const { receiver, message, group } = req.body;

      const checkGroup = await Group.findById(group);

      if (!checkGroup) {
        return res.status(404).json({
          message: 'Nhóm không tồn tại'
        })
      }

      if (checkGroup.isDeleted) {
        return res.status(400).json({
          message: 'Nhóm đã bị xóa'
        })
      }

      if (checkGroup.admin.toString() === receiver) {
        return res.status(400).json({
          message: 'Bạn không thể mời chính mình'
        })
      }

      if (checkGroup.admin.toString() !== sender) {
        return res.status(400).json({
          message: 'Bạn không phải quản trị viên của nhóm này'
        })
      }

      const invitation = new Invitation({
        sender,
        receiver,
        message,
        group
      });

      await invitation.save();

      return res.status(200).json(invitation);
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi xảy ra"
      })
    }
  },
  acceptInvitation: async (req, res) => {
    try {
      const { sub: receiver } = req.user;
      const { id } = req.body;
      console.log(req.body)

      const invitation = await Invitation.findOneAndUpdate({ _id: id, receiver }, { status: 'accepted' });
      if (!invitation) {
        return res.status(404).json({
          status: 'error',
          message: 'Lời mời không tồn tại'
        })
      }

      const group = await Group.findById(invitation.group);
      if (!group) {
        return res.status(404).json({
          status: 'error',
          message: 'Nhóm không tồn tại'
        })
      }

      if (group.isDeleted) {
        return res.status(400).json({
          status: 'error',
          message: 'Nhóm đã bị xóa'
        })
      }

      if (group.admin.toString() === receiver) {
        return res.status(400).json({
          status: 'error',
          message: 'Bạn đã là quản trị viên của nhóm này'
        })
      }

      if (group.members.find(member => member.user.toString() === receiver)) {
        return res.status(400).json({
          status: 'error',
          message: 'Bạn đã tham gia nhóm này'
        })
      }

      group.members.push({
        user: receiver,
        role: 'member'
      });
      await group.save();

      return res.status(200).json({
        message: 'Tham gia nhóm thành công',
        status: 'success',
        invitation
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Có lỗi xảy ra"
      })
    }
  },
  rejectInvitation: async (req, res) => {
    try {
      const { sub: receiver } = req.user;
      const { id } = req.body;

      const invitation = await Invitation.findOneAndUpdate({ _id: id, receiver }, { status: 'rejected' });
      if (!invitation) {
        return res.status(404).json({
          message: 'Lời mời không tồn tại'
        })
      }

      return res.status(200).json(invitation);
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi xảy ra"
      })
    }
  },
  cancelInvitation: async (req, res) => {
    try {
      const { sub: sender } = req.user;
      const { id } = req.body;

      const invitation = await Invitation.findByIdAndRemove({ _id: id, sender });
      if (!invitation) {
        return res.status(404).json({
          message: 'Lời mời không tồn tại'
        })
      }

      return res.status(200).json(invitation);
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi xảy ra"
      })
    }
  },
  getInvitations: async (req, res) => {
    try {
      const { sub: receiver } = req.user;
      const invitations = await Invitation.find({ receiver }).populate('sender', 'name').populate('group', 'name').sort({ createdAt: -1 });
      return res.status(200).json(invitations);
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi xảy ra"
      })
    }
  },
  getInvitation: async (req, res) => {
    try {
      const { sub: receiver } = req.user;
      const { id } = req.params;

      const invitation = await Invitation.findOne({ _id: id, receiver }).populate('sender', 'name').populate('group', 'name');
      if (!invitation) {
        return res.status(404).json({
          message: 'Lời mời không tồn tại'
        })
      }

      return res.status(200).json(invitation);
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi xảy ra"
      })
    }
  },
  getInvitationByGroup: async (req, res) => {
    try {
      const { sub: receiver } = req.user;
      const { id } = req.params;

      const invitation = await Invitation.findOne({ group: id, receiver }).populate('sender', 'name').populate('group', 'name');
      if (!invitation) {
        return res.status(404).json({
          message: 'Lời mời không tồn tại'
        })
      }

      return res.status(200).json(invitation);
    } catch (error) {
      return res.status(500).json({
        message: "Có lỗi xảy ra"
      })
    }
  },
};

module.exports = invitationController;