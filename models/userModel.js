import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, dropDups: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isNewUser: { type: Boolean, default: true },
  userDataRef: { type: mongoose.Types.ObjectId, ref: 'UserData', default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
