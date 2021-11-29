import {STATUS_LIST} from 'constants/master_data';
import {IUser, Log} from 'models';
import {PROFILE_PERCENTAGE} from 'loaders/config';

const TAG = 'helpers.user';

export function profileCalculation(data: IUser) {
    try {
        let total = 0;
        total += (data.firstName) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_1 : 0;
        total += (data.lastName) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_1 : 0;
        total += (data.age) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_1 : 0;
        total += (data.dob) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_1 : 0;
        total += (data.graduationYear) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_1 : 0;
        total += (data.qualification) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_1 : 0;
        total += (data.emailId) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_3 : 0;
        total += (data.profileImage) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_2 : 0;
        total += (data.mobileNumber) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_3 : 0;
        total += (data.graduateFrom) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_2 : 0;
        total += (data.currentAddress) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_3 : 0;
        // total += (data.permanentAddress) ? PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_2 : 0;
        total += data?.idProof?.length != 0 ?
            (data?.idProof?.length ?? 0) * PROFILE_PERCENTAGE.PROFILE_PERCENT_VALUE_3 : 0;
        return total;
    } catch (error) {
        Log.error(TAG, 'profileCalculation()', error);
    }
}
