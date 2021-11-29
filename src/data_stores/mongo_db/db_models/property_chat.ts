const MODEL_NAME = 'property_chat';
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    property_request_id: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    content: {
        type: String,
    },
    attachment_path: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    last_updated_at: {
        type: Date,
        default: Date.now,
    }
}, {
    strict: true
});

export default mongoose.model(MODEL_NAME, chatSchema);
