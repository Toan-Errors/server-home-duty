const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  description: {
    type: String,
  },
  time_start: {
    type: Date,
    default: Date.now,
    required: true
  },
  time_end: {
    type: Date,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);