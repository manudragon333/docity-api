import User from '../db_models/user';
import {IBaseListAPIRequest, IUser, Log} from 'models';
import {findAllRecords, findOne, findOneAndUpdate} from 'data_stores/mongo_db/helpers/query';
import {userDataMapping} from 'data_stores/mongo_db/helpers/data_mapping/user';
import {STATUS_LIST} from 'constants/master_data';

const populatePaths = [{
    path: 'role_obj',
    select: {
        _id: 1,
        nm: 1
    }
}];
const TAG = 'data_stores.mongo_db.lib.user';

export async function saveUser(doc: IUser) {
    try {
        const user = new User({
            f_nm: doc?.firstName,
            l_nm: doc?.lastName ?? null,
            full_nm: doc.fullName ?? null,
            email: doc?.emailId ?? null,
            ph_no: doc?.mobileNumber ?? null,
            role_obj: doc?.role ?? null,
            password: doc?.password ?? null,
            status: doc.status ?? STATUS_LIST['0'].id,
            terms_conditions: doc?.termsAndConditions
        });
        await user.save();
        const result = await User.populate(user, populatePaths);
        return userDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'saveUser()', error);
        throw error;
    }
}

export async function fetchUserDetails(userName: string) {
    try {
        const result = await findOne(User, {
            email: userName,
        }, {
            _id: 1,
            f_nm: 1,
            l_nm: 1,
            email: 1,
            ph_no: 1,
            password: 1,
            pic: 1,
            status: 1,
        }, {}, [{
            path: 'role_obj',
            select: {
                _id: 1,
                nm: 1
            }
        }]);
        return userDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'fetchUserDetails()', error);
        throw error;
    }
}

export async function checkDuplicateEmail(emailId: string, userId?: string): Promise<boolean> {
    try {
        const result = await findOne(User, {
            _id: {
                $not: {
                    $eq: userId
                },
            },
            email: emailId,
        }, {
            _id: 1,
        });
        return !!result;
    } catch (error) {
        Log.error(TAG, 'checkDuplicateEmail()', error);
        throw error;
    }
}

export async function checkDuplicateMobile(mobileNumber: string, userId?: string): Promise<boolean> {
    try {
        const result = await findOne(User, {
            _id: {
                $not: {
                    $eq: userId
                },
            },
            ph_no: mobileNumber,
        }, {
            _id: 1,
        });
        return !!result;
    } catch (error) {
        Log.error(TAG, 'checkDuplicateMobile()', error);
        throw error;
    }
}
