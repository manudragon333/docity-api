const modelName = 'question';
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({

    ques: {
        type: String
    },
    options: [{
        type: String
    }],
    answr: {
        type: String
    },
    typ: {
        type: String
    },
    c_dt: {
        type: Date
    }

}, {
    strict: true
});

export default mongoose.model( modelName, questionSchema)
