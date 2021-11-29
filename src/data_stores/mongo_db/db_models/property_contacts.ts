const modelName = 'property_contact';
import mongoose from 'mongoose';

const contactMeSchema = new mongoose.Schema({
    property_type_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'property_type'
    },
    property_type: {
        type: String,
        required: true,
    },
    region_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'region'
    },
    region_name: {
        type: String,
        required: true,
    },
    name: {
        type: String
    },
    email_id: {
        type: String,
    },
    contact_number: {
        type: String,
    },
    c_dt: {
        type: Date,
    },
    c_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    assigned_to: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    status: {
        type: String,
    }
}, {
    strict: true
});

export default mongoose.model(modelName, contactMeSchema);
