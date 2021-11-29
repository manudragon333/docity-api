const modelName = 'answer';
import mongoose from 'mongoose';

let answerSchema = new mongoose.Schema({

    u_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    ques_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question'
    },
    answr: {
        type: String
    },
    points: {
        type: Number
    },
    desc: {
        type: String,
        default: ''
    },
    c_dt: {
        type: Date
    }

}, {
    strict: true
});

export default mongoose.model(modelName, answerSchema);
