const modelName = 'invitation';
import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
    u_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    email: {
        type: String
    },
    name: {
        type: String,
    },
    role_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    status: {
        type: Number
    },
    c_dt: {
        type: Date
    },
    m_dt: {
        type: Date
    }

}, {
    strict: true
});

export default mongoose.model(modelName, inviteSchema);
