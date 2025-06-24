const mongoose = require('mongoose');

const studentBranchSchema = new mongoose.Schema({
  website: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  foundedYear: {
    type: Number,
    default: new Date().getFullYear(),
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Execom',
  }],
}, { timestamps: true });

const StudentBranch = mongoose.model('StudentBranch', studentBranchSchema);
module.exports = StudentBranch;
