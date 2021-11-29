const modelName = 'orderReportNotes';
import mongoose from 'mongoose';

let commentSchema = new mongoose.Schema({
    title: {
        type: String
    },
    desc: {
        type: String
    },
    page: {
        type: Number
    }
})
let schema = new mongoose.Schema({
    u_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    ordr_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },
    doc_obj: {
        type: mongoose.Schema.Types.ObjectId
    },
    comment: [commentSchema],
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
