import mongoose from 'mongoose';

const modelName = 'assessment_questions';

export const assessmentQuestion = new mongoose.Schema({
        assessment_question: {
            type: String,
            required: true
        },
        options: [{
            type: String,
        }],
        question_type: {
            type: String,
            required: true
        },
        actual_answer: {
            type: String,
            required: true
        },
        c_dt: {
            type: Date,
            default: Date.now,
        }
    },
    {
        strict: true
    }
);

export default mongoose.model(modelName, assessmentQuestion);
