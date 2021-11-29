import mongoose from 'mongoose';
import {assessmentQuestion} from 'data_stores/mongo_db/db_models/assessment_questions';

const modelName = 'ce_assessment';

const civilEngineerAssessmentResult = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    question: {
        type: assessmentQuestion,
        required: true
    },
    answer: {
        type: String,
        required: true,
    },
    is_correct_answer: {
        type: Boolean,
        required: false
    }
}, {
    strict: true
});

export default mongoose.model(modelName, civilEngineerAssessmentResult);
