import mongoose from 'mongoose';

function arrayLimit(val) {
    return val.length == 4;
}

const pickCorrectItemSchema = new mongoose.Schema({
    item_id: { type: String, required: true, index: true, unique: true },
    question: { type: String, required: true },
    options: {
        type: [{
            type: String, required: true
        }],
        required: true,
        validate: [arrayLimit, 'options must contain 4 options only']
    },
    correctOption: {
        type: Number, required: true, min: 0, max: 3
    },
    image_url: { type: String, default: null },
    sound_url: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.PickCorrectItems || mongoose.model('PickCorrectItems', pickCorrectItemSchema);