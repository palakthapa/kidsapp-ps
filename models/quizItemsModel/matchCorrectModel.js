import mongoose from 'mongoose';

function arrayLimit(val) {
    return val.length == 4;
}

const matchCorrectItemSchema = new mongoose.Schema({
    item_id: { type: String, required: true, index: true, unique: true },
    question: { type: String, required: true },
    leftOptions: {
        type: [{
            type: String, required: true
        }],
        required: true,
        validate: [arrayLimit, 'leftOptions must contain 4 options only']
    },
    rightOptions: {
        type: [{
            type: String, required: true
        }],
        required: true,
        validate: [arrayLimit, 'rightOptions must contain 4 options only']
    },
    correctMatch: {
        type: [{
            type: Number, required: true, min: 0, max: 3
        }],
        required: true,
        validate: [arrayLimit, 'rightOptions must contain 4 options only']
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.MatchCorrectItems || mongoose.model('MatchCorrectItems', matchCorrectItemSchema);