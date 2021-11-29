import {REGION_TYPES} from 'constants/master_data';

const modelName = 'property_type';
import mongoose from 'mongoose';

const propertyTypeSchema = new mongoose.Schema({
    pt_name: {
        type: String,
        unique: true,
    },
    pt_code: {
        type: String
    },
    status: {
        type: Number
    },
    region_type: {
        type: String,
        default: REGION_TYPES.SRO.name,
    }
}, {
    strict: true
});

export default mongoose.model(modelName, propertyTypeSchema);
