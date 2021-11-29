const modelName = 'document_type';
import mongoose from 'mongoose';

const documentType = new mongoose.Schema({
        document_type: {
            type: String,
            unique: true,
        },
        document_type_code: {
            type: String,
            unique: true
        }
    }, {
        strict: true
    }
);

export default mongoose.model(modelName, documentType);
