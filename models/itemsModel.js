import mongoose from 'mongoose';

const itemsSchema = new mongoose.Schema({
    item_id: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    image_url: { type: String, required: true },
    sound_url: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Items || mongoose.model('Items', itemsSchema);