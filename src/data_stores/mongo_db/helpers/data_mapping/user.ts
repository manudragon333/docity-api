import {IUser, Log, User, IUserSession, BaseRecord} from 'models';

const TAG = 'dat_stores.mongodb.data_mapping.user';

export function userDataMapping(payload: any): IUser {
    try {
        if (payload) {
            payload.role_obj = payload?.role_obj?.map((role) => {
                    return new BaseRecord(role._id, role.nm);
                }
            );
            return new User(
                {} as IUserSession,
                payload?.f_nm,
                payload?.ph_no,
                payload?.email,
                payload?.role_obj,
                payload?.l_nm,
                payload?.password,
                payload?.dob,
                payload?.id_proof,
                payload?.age,
                payload?.country_code,
                payload?.grad_from,
                payload?.yr_of_pass,
                payload?.currnt_addr,
                payload?.prmnt_addr,
                payload?.terms_conditions,
                payload?.qualification,
                payload?.pic,
                payload?.t_pic,
                payload?.kyc,
                payload?.on_training,
                payload?.assessment,
                payload?.profile_percent,
                payload?.status,
                payload?.read_msg,
                payload?._id,
            );
        }
        return payload;
    } catch (error) {
        Log.error(TAG, 'userDataMapping()', error);
        throw error;
    }
}
