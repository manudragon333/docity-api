const modelName = 'role';
import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    role_id: {
        type: Number
    },
    nm: {
        type: String
    },
    status: {
        type: Number,
        default: 1
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

export default mongoose.model(modelName, roleSchema);
