const modelName = 'property_request';
import mongoose from 'mongoose';

const finalReport = new mongoose.Schema({
    path: {
        type: String,
    },
    note: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    last_updated_at: {
        type: Date,
    },
    last_updated_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
}, {
    _id: false
});

const propertyTypeSchema = new mongoose.Schema({
    reference_id: {
        type: String,
        unique: true,
    },
    property_type_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'property_type',
        required: true
    },
    property_type: {
        type: String,
        required: true,
    },
    region_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'region',
        required: true
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
    requested_user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    document_writer: {
        type: new mongoose.Schema({
            name: {
                type: String,
            },
            contact_number: {
                type: String,
            }
        })
    },
    civil_engineer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    civil_engineer_response: {
        type: Number,
        default: 4,
    },
    estimated_finish_date: {
        type: String,
        default: null,
    },
    final_report: finalReport,
    status: {
        type: Number,
        default: 0,
    },
    payment_status: {
        type: Number,
        default: 4,
    },
    c_dt: {
        type: Date,
    },
    m_dt: {
        type: Date,
    },
    c_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    m_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
}, {
    strict: true,
});

propertyTypeSchema.index({
    name: 'text',
    property_type: 'text',
    region_name: 'text',
    city: 'text',
});

export default mongoose.model(modelName, propertyTypeSchema);
