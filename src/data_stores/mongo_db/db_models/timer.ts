const modelName = 'timer';
import mongoose from 'mongoose';

let timerSchema = new mongoose.Schema({
    hr: {
        type: Number
    },
    min:{
        type: Number
    },
    sec:{
        type: Number
    }
}, {
    strict: true
})

export default mongoose.model(modelName, timerSchema)
