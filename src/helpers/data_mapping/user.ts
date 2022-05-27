import { IUser, IUserSession, Log, User } from "models";
import mongoose from "mongoose";

const TAG = "heplers.data_mapping.user";

export function userDataMapping(
  payload: any,
  userId?: string,
  loggedInUser?: IUserSession
): IUser {
  try {
    if (payload) {
      payload.role = payload?.role?.map((role) => {
        return mongoose.Types.ObjectId(role.id);
      });
      const user = new User(
        loggedInUser ? loggedInUser : ({} as IUserSession),
        payload?.firstName,
        payload?.mobileNumber,
        payload?.emailId,
        payload?.role,
        payload?.lastName,
        payload?.password,
        payload?.dob,
        payload?.idProof,
        payload?.age,
        payload?.countryCode,
        payload?.graduateFrom,
        payload?.graduationYear,
        payload?.currentAddress,
        payload?.permanentAddress,
        payload?.termsAndConditions,
        payload?.qualification
      );
      user.id = userId;
      if (payload?.region) {
        user.region = payload?.region;
      }
      return user;
    }
    return payload;
  } catch (error) {
    Log.error(TAG, "userDataMapping()", error);
    throw error;
  }
}
