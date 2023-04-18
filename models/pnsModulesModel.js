import mongoose from 'mongoose';

const pnsModuleSchema = new mongoose.Schema({
    module_id: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    sound_url: { type: String, required: true },
    images: {
        type: [{
            type: String, required: true
        }],
        required: true
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.PnSModules || mongoose.model('PnSModules', pnsModuleSchema);