const modelName = 'sequence_nbs';

import mongoose from 'mongoose';

const regionSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    series: {
        type: String,
        required: true,
    },
    nb: {
        type: Number,
        default: 0
    },
}, {
    strict: true
});

export default mongoose.model(modelName, regionSchema);
