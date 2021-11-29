const modelName = 'orderReportsHistory';
import mongoose from 'mongoose';

let schema = new mongoose.Schema({
    u_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    ordr_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },
    doc_link: {
        type: String
    },
    status: {
        type: Number,
        default: 0
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

export default mongoose.model(modelName, schema);
