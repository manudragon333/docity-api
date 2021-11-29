import mongoose from 'mongoose';

const modelName = 'property_document';

const commentSchema = new mongoose.Schema({
    note: {
        type: String,
    },
    type: {
        type: String,
    },
    pos_x: {
        type: Number,
    },
    pos_y: {
        type: Number,
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    page_nb: {
        type: Number,
    },
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    last_updated_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    created_at: {
        type: Date,
    },
    last_updated_at: {
        type: Date,
    },
});

const propertyDocumentSchema = new mongoose.Schema({
    property_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'property_request'
    },
    attachment_type_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'document_type',
    },
    attachment_type: {
        type: String,
    },
    mime_type: {
        type: String,
    },
    path: {
        type: String,
    },
    name: {
        type: String,
    },
    notes: {
        type: String,
    },
    comments: [commentSchema],
});

export default mongoose.model(modelName, propertyDocumentSchema);
