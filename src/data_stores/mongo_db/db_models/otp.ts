const modelName = 'user_otp';
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    u_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    otp: {
        type: String,
    },
    token: {
        type: String,
    },
    status: {
        type: Number
    },
    c_dt: {
        type: Date
    }
}, {
    strict: true
});

export default mongoose.model(modelName, paymentSchema);
