import mongoose from 'mongoose';

const learningModuleSchema = new mongoose.Schema({
    module_id: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    image_url: { type: String, required: true },
    items: {
        type: [{
            type: mongoose.Types.ObjectId, required: true, ref: "Items"
        }],
        default: []
    },
    included_in: {
        type: {
            _id: false,
            keyboard: { type: Boolean, default: false },
            draganddrop: { type: Boolean, default: false },
            draw: { type: Boolean, default: false }
        }
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.LearningModules || mongoose.model('LearningModules', learningModuleSchema);