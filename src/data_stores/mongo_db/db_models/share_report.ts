const modelName = "share_report";
import mongoose from "mongoose";

const shareReportSchema = new mongoose.Schema(
  {
    u_obj: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    email: {
      type: String,
    },
    report_uri: {
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

export default mongoose.model(modelName, shareReportSchema);
