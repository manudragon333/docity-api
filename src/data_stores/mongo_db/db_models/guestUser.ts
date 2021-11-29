const modelName = 'guestUser';
import mongoose from 'mongoose';

let guestUserSchema = new mongoose.Schema({

    email: {
        type: String
    },
    pswrd: {
        type: String
    },
    ordr_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },
    u_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    c_dt: {
        type: Date
    },
    m_dt: {
        type: Date
    }
}, {
    strict: true
})

export default mongoose.model(modelName, guestUserSchema)
