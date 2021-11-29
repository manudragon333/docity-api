const modelName = "contactUs";
import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema(
  {
    f_nm: {
      type: String,
    },
    l_nm: {
      type: String,
    },
    subjct: {
      type: String,
    },
    email: {
      type: String,
    },
    ph_no: {
      type: String,
    },
    addr: {
      type: String,
    },
    msg: {
      type: String,
    },
    c_dt: {
      type: Date,
    },
    m_dt: {
      type: Date,
    },
  },
  {
    strict: true,
  }
);

export default mongoose.model(modelName, contactUsSchema);
