const modelName = 'attachment';
import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
    mime_type: {
        type: String,
    },
    path: {
        type: String,
    },
    name: {
        type: String,
    }
});

export default mongoose.model(modelName, attachmentSchema);
