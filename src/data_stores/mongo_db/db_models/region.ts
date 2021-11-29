const modelName = 'region';
import mongoose from 'mongoose';

const regionSchema = new mongoose.Schema({
    region_name: {
        type: String,
        unique: true,
    },
    region_code: {
        type: String,
    },
    status: {
        type: Number
    },
    region_type: {
        type: String,
    }
}, {
    strict: true
});

export default mongoose.model(modelName, regionSchema);
