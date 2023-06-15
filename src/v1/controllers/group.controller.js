const Group = require('../models/group.model');
const Task = require('../models/task.model');

const groupController = {
  create: async (req, res) => {
    try {
      const { name, description, isPrivate } = req.body;
      const { sub: admin } = req.user;
      const group = await Group.create({ name, description, isPrivate, admin });
      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({
        message: 'Create group failed',
      });
    }
  },
  remove: async (req, res) => {
    try {
      const { sub: admin } = req.user;
      const { id } = req.params;

      const group = await Group.findOneAndUpdate({ _id: id, admin }, { isDeleted: true });
      if (!group) {
        return res.status(404).json({
          message: 'Nhóm này không phải của bạn hoặc không tồn tại',
        });
      }

      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({
        message: 'Có lỗi xảy ra',
      });
    }
  },
  update: async (req, res) => {
    try {
      const { sub: admin } = req.user;
      const { id } = req.params;
      const { name, description, isPrivate } = req.body;

      const group = await Group.findOneAndUpdate({ _id: id, admin }, { name, description, isPrivate });
      if (!group) {
        return res.status(404).json({
          message: 'Nhóm này không phải của bạn hoặc không tồn tại',
        });
      }

      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({
        message: 'Có lỗi xảy ra',
      });
    }
  },
  addMember: async (req, res) => {
    try {
      const { sub: admin } = req.user;
      const { id } = req.params;
      const { userId } = req.body;

      const group = await Group.findOne({ _id: id, admin });
      if (!group) {
        return res.status(404).json({
          message: 'Group not found',
        });
      }

      const isMember = group.members.find(member => member.toString() === userId);
      if (isMember) {
        return res.status(400).json({
          message: 'User is already a member',
        });
      }

      group.members.push(userId);
      await group.save();

      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({
        message: 'Add member failed',
      });
    }
  },
  removeMember: async (req, res) => {
    try {
      const { sub: admin } = req.user;
      const { id } = req.params;
      const { userId } = req.body;

      const group = await Group.findOne({ _id: id, admin });
      if (!group) {
        return res.status(404).json({
          message: 'Group not found',
        });
      }

      const isMember = group.members.find(member => member.toString() === userId);
      if (!isMember) {
        return res.status(400).json({
          message: 'User is not a member',
        });
      }

      group.members = group.members.filter(member => member.toString() !== userId);
      await group.save();

      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({
        message: 'Remove member failed',
      });
    }
  },
  getGroups: async (req, res) => {
    try {
      const { sub: admin } = req.user;
      const groups = await Group.find({
        isDeleted: false,
        $or: [
          { admin },
          { members: { $elemMatch: { user: admin } } },
        ],
      })
        .populate('members.user', 'name email')
        .sort({ createdAt: -1 })
        || [];
      return res.status(200).json(groups);
    } catch (error) {
      return res.status(500).json({
        message: 'Get group failed',
      });
    }
  },
  getGroup: async (req, res) => {
    try {
      const { sub: admin } = req.user;
      const { id } = req.params;
      console.log(id, admin)
      const group = await Group.findOne({ _id: id, admin })
        .populate('members.user', 'name email')

      if (!group) {
        return res.status(404).json({
          message: 'Group not found',
        });
      }

      const tasks = await Task.find({ group: id, isDeleted: false })
        .populate('admin', 'name email')
        .populate('members', 'name email')
        .sort({ createdAt: -1 })
        || [];

      return res.status(200).json({
        ...group._doc,
        tasks,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Get group failed',
      });
    }
  },
};

module.exports = groupController;