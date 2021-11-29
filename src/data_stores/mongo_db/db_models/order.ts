const modelName = 'order';
const _ = require('lodash');

const mongoose = require('mongoose')
require('mongoose-double')(mongoose);

let SchemaTypes = mongoose.Schema.Types;

let finalReportSchema = new mongoose.Schema({
    path: {
        type: String
    },
    notes: {
        type: String
    }
}, {
    _id: true,
    strict: true
})

let docsSchema = new mongoose.Schema({
    typ: {
        type: String
    },
    paths: [{
        type: String
    }],
    notes: {
        type: String
    }
}, {
    _id: true,
    strict: true
});

let docWriterSchema = new mongoose.Schema({
    nm: {
        type: String
    },
    ph_no: {
        type: String
    },
    typ: {
        type: String
    }
}, {
    _id: false,
    strict: true
});

let orderSchema = new mongoose.Schema({
    order_id: {
        type: Number
    },
    u_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    reg_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'region'
    },
    addr: {
        type: String
    },
    doc_writer: docWriterSchema,
    razorpay_id: {
        type: String
    },
    docs: [docsSchema],
    final_reprt: finalReportSchema,
    u_nm: {
        type: String
    },
    engr_nm: {
        type: String
    },
    area: {
        type: String
    },
    typ: {
        type: String
    },
    pincode: {
        type: String
    },
    todo_date: {
        type: String
    },
    lat: {
        type: SchemaTypes.Double
    },
    lng: {
        type: SchemaTypes.Double
    },
    state: {
        type: String
    },
    cntry: {
        type: String
    },
    engr_obj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    ordr_status: {
        type: Number
    },
    engnr_status: {
        type: Number,
        default: 0
    },
    payment_status: {
        type: Number
    },
    engr_reason: {
        type: String
    },
    c_dt: {
        type: Date,
    },
    m_dt: {
        type: Date,
    }
}, {
    strict: true
});

export default mongoose.model(modelName, orderSchema)

orderSchema.index({
    u_obj: 1,
    engr_obj: 1
}, {
    unique: true
});
