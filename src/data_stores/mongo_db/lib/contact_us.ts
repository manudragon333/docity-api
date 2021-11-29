import ContactUs from "../db_models/contactUs";
import { IAttachment, IUser, IUserSession, Log } from "models";
import {
  countRecords,
  findAllRecords,
  findOne,
  findOneAndUpdate,
} from "data_stores/mongo_db/helpers/query";
import { userDataMapping } from "data_stores/mongo_db/helpers/data_mapping/user";
import { STATUS_LIST } from "constants/master_data";
import { Types } from "mongoose";
import { IUserListApiRequest } from "src/models/lib/api_requests/user_list_api_request";
import ShareReport from "../db_models/share_report";

// const populatePaths = [
//   {
//     path: "role_obj",
//     select: {
//       _id: 1,
//       nm: 1,
//     },
//   },
// ];

const TAG = "data_stores.mongo_db.lib.contact_us";

export async function saveContactUs(payload: any) {
  try {
    const contactUs = new ContactUs({
      u_obj: payload.name ?? null,
      f_nm: payload.firstName ?? null,
      l_nm: payload?.firstName ?? null,
      subjct: payload?.queryTypes ?? null,
      email: payload?.emailId ?? null,
      ph_no: payload?.mobileNumber ?? null,
      addr: payload?.address ?? null,
      msg: payload?.message ?? null,
      c_dt: new Date(),
      m_dt: new Date(),
    });
    Log.info("shareReport save: ", contactUs);
    const result = await contactUs.save();
    return result;
  } catch (error) {
    Log.error(TAG, "saveContactUsData()", error);
    throw error;
  }
}
