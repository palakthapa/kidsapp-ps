import mongoose from 'mongoose';

const userDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.UserData || mongoose.model('UserData', userDataSchema);