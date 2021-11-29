const modelName = 'orderConversation';
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
    doc: {
        type: String
    },
    msg: {
        type: String
    },
    status: {
        type: Number,
        default: 0
    },
    c_dt: {
        type: Date
    }
}, {
    strict: true
});

schema.virtual('user', {
    ref: 'user',
    localField: 'u_obj',
    foreignField: '_id',
    justOne: true
})

export default mongoose.model(modelName, schema);

schema.index({
    u_obj: 1,
    ordr_obj: 1
}, {
    unique: true
});
