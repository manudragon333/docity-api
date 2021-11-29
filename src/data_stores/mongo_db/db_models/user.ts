import {number} from "joi";

const modelName = 'user';
import mongoose from 'mongoose';

const idProofSchema = new mongoose.Schema({
    type: {
        type: String,
    },
    path: {
        type: String
    }
}, {
    _id: false,
    strict: true
});

const userSchema = new mongoose.Schema({

    u_id: {
        type: Number,
    },
    f_nm: {
        type: String,
        default: null
    },
    l_nm: {
        type: String,
        default: null
    },
    full_nm: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    dob: {
        type: String,
        default: ''
    },
    ph_no: {
        type: String,
        default: null
    },
    role_obj: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    }],
    id_proof: [idProofSchema],
    country_code: {
        type: String,
        default: null,
    },
    qualification: {
        type: String,
        default: null,
    },
    grad_from: {
        type: String,
        default: null,
    },
    yr_of_pass: {
        type: Number,
        default: null,
    },
    currnt_addr: {
        type: String,
        default: null
    },
    prmnt_addr: {
        type: String,
        default: null
    },
    age: {
        type: Number,
        default: null
    },
    pic: {
        type: String,
        default: null
    },
    t_pic: {
        type: String
    },
    kyc: {
        type: Number,
        default: 4,
    },
    on_training: {
        type: Number,
        default: 4,
    },
    assessment: {
        type: Number,
        default: 4
    },
    assessment_marks: {
        type: Number,
        default: 0
    },
    profile_percent: {
        type: Number,
        default: 0,
    },
    status: {
        type: Number,
        default: 0
    },
    read_msg: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
    },
    approved: {
        type: Number,
        default: 0,
    },
    terms_conditions: {
        type: Boolean,
        default: false,
    },
    c_dt: {
        type: Date,
    },
    m_dt: {
        type: Date,
    },

}, {
    strict: true
});

userSchema.index({
    email: 1,
    u_id: 1,
    role_obj: 1
}, {
    unique: true
});

export default mongoose.model(modelName, userSchema);
