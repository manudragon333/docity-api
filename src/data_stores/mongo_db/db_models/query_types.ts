const modelName = 'query_types';
import mongoose from 'mongoose';

const queryTypesSchema = new mongoose.Schema({
    query_type: {
        type: String,
        unique: true,
    },
    status: {
        type: Number
    },
}, {
    strict: true
});

export default mongoose.model(modelName, queryTypesSchema);
