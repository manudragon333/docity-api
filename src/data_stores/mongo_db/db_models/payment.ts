const modelName = 'payment';
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    property_request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property_request'
    },
    amount: {
        type: Number
    },
    transaction_id: {
        type: String
    },
    rp_sign: {
        type: String
    },
    rp_order_id: {
        type: String
    },
    payment_method: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: Number
    },
    c_dt: {
        type: Date
    },
    m_dt: {
        type: Date,
    },
}, {
    strict: true
});

export default mongoose.model(modelName, paymentSchema);
