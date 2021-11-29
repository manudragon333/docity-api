import User from '../db_models/user';
import {IAttachment, IUser, IUserSession, Log} from 'models';
import {countRecords, findAllRecords, findOne, findOneAndUpdate} from 'data_stores/mongo_db/helpers/query';
import {userDataMapping} from 'data_stores/mongo_db/helpers/data_mapping/user';
import {STATUS_LIST} from 'constants/master_data';
import {Types} from 'mongoose';
import {IUserListApiRequest} from 'src/models/lib/api_requests/user_list_api_request';
import Invitation from '../db_models/invitation';
import ShareReport from '../db_models/share_report'

const populatePaths = [{
    path: 'role_obj',
    select: {
        _id: 1,
        nm: 1
    }
}];
const TAG = 'data_stores.mongo_db.lib.user';

export async function saveUser(loggedInUser: IUserSession, doc: IUser) {
    try {
        const user = new User({
            f_nm: doc.firstName ?? null,
            ph_no: doc.mobileNumber ?? null,
            email: doc.emailId ?? null,
            role_obj: doc.role ?? null,
            l_nm: doc.lastName ?? null,
            full_nm: doc.fullName ?? null,
            password: doc.password ?? null,
            dob: doc.dob ?? null,
            age: doc.age ?? null,
            country_code: doc.countryCode ?? null,
            grad_from: doc.graduateFrom ?? null,
            yr_of_pass: doc.graduationYear ?? null,
            currnt_addr: doc.currentAddress ?? null,
            prmnt_addr: doc.permanentAddress ?? null,
            profile_percent: doc.profilePercentage ?? 0,
            kyc: STATUS_LIST['4'].id,
            c_dt: new Date(),
            m_dt: new Date(),
        });
        await user.save();
        const result = await User.populate(user, populatePaths);
        return userDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'saveUser()', error);
        throw error;
    }
}

export async function fetchUserDetails(userId: string) {
    try {
        const result = await findOne(User, {
            _id: userId,
        }, {
            f_nm: 1,
            ph_no: 1,
            email: 1,
            role_obj: 1,
            l_nm: 1,
            dob: 1,
            id_proof: 1,
            age: 1,
            country_code: 1,
            grad_from: 1,
            yr_of_pass: 1,
            currnt_addr: 1,
            prmnt_addr: 1,
            pic: 1,
            t_pic: 1,
            kyc: 1,
            on_training: 1,
            assessment: 1,
            profile_percent: 1,
            qualification: 1,
            status: 1,
            read_msg: 1,
            _id: 1,
            approved: 1
        }, {}, populatePaths);
        return userDataMapping(result);
    } catch (error) {
        Log.error(TAG, 'fetchUserDetails()', error);
        throw error;
    }
}

export async function fetchUserPassword(userId: string) {
    try {
        const result = await findOne(User, {
            _id: userId,
        }, {
            password: 1,
        }, {}, populatePaths);
        return result?.password;
    } catch (error) {
        Log.error(TAG, 'fetchUserDetails()', error);
        throw error;
    }
}

export async function fetchUsers(loggedInUser: IUserSession, queryParams?: IUserListApiRequest) {
    try {
        const excludeRoleIds = loggedInUser.role.map((role) => role.id);
        const condition: any = {
            $and: [{
                role_obj: {
                    $nin: excludeRoleIds,
                }
            }],
        };
        if (queryParams.roles.length) {
            condition.$and.push({
                    role_obj: {
                        $in: queryParams.roles,
                    }
                },
            );
        }
        if (queryParams?.status?.length) {
            condition.$and.push({
                    status: {
                        $in: queryParams.status,
                    }
                },
            );
        }
        const result = await findAllRecords(User, condition, {
            f_nm: 1,
            ph_no: 1,
            email: 1,
            role_obj: 1,
            l_nm: 1,
            dob: 1,
            id_proof: 1,
            age: 1,
            country_code: 1,
            grad_from: 1,
            yr_of_pass: 1,
            currnt_addr: 1,
            prmnt_addr: 1,
            pic: 1,
            t_pic: 1,
            kyc: 1,
            on_training: 1,
            assessment: 1,
            profile_percent: 1,
            qualification: 1,
            status: 1,
            read_msg: 1,
            _id: 1,
        }, {}, populatePaths);
        const users: IUser[] = [];
        for (const user of result) {
            users.push(userDataMapping(user));
        }
        return users;
    } catch (error) {
        Log.error(TAG, 'fetchUsers()', error);
        throw error;
    }
}

export async function fetchUsersCount(loggedInUser: IUserSession, queryParams?: IUserListApiRequest) {
    try {
        const excludeRoleIds = loggedInUser.role.map((role) => role.id);
        let condition: any = {
            role_obj: {
                $nin: excludeRoleIds,
            },
        };
        if (queryParams.roles.length) {
            condition = {};
            condition.$and = [{
                role_obj: {
                    $nin: excludeRoleIds,
                },
            }, {
                role_obj: {
                    $in: queryParams.roles,
                },
            }];
        }
        return await countRecords(User, condition, {});
    } catch (error) {
        Log.error(TAG, 'fetchUsersCount()', error);
        throw error;
    }
}

export async function updateUser(loggedInUser: IUserSession, doc: IUser) {
    try {
        return await findOneAndUpdate(User, {
            _id: doc?.id
        }, {
            f_nm: doc.firstName,
            ph_no: doc.mobileNumber,
            email: doc.emailId,
            l_nm: doc.lastName,
            full_nm: doc.fullName,
            dob: doc.dob,
            age: doc.age,
            country_code: doc.countryCode,
            qualification: doc.qualification,
            grad_from: doc.graduateFrom,
            yr_of_pass: doc.graduationYear,
            currnt_addr: doc.currentAddress,
            prmnt_addr: doc.permanentAddress,
            m_dt: new Date(),
        }, {});
    } catch (error) {
        Log.error(TAG, 'updateUser()', error);
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

export async function updateProfileImage(loggedInUser: IUserSession, userId: string, profileImage: string) {
    Log.debug('Started updating profile image');
    try {
        const result = await findOneAndUpdate(User, {
            _id: userId,
        }, {
            $set: {
                pic: profileImage,
                m_dt: new Date(),
            }
        });
        return result;
    } catch (error) {
        Log.error(TAG, 'updateProfileImage()', error);
        throw error;
    }
}

export async function updatePassword(loggedInUser: IUserSession, userId: string, password: string) {
    Log.debug('Started updating password');
    try {
        const result = await findOneAndUpdate(User, {
            _id: Types.ObjectId(userId),
        }, {
            $set: {
                password: password,
                m_dt: new Date(),
            },
        });
        return result;
    } catch (error) {
        Log.error(TAG, 'updatePassword()', error);
        throw error;
    }
}

export async function addIdProof(loggedInUser: IUserSession, userId: string, attachment: IAttachment) {
    Log.debug('Started adding id proof');
    try {
        const result = await findOneAndUpdate(User, {
            _id: userId,
        }, {
            $addToSet: {
                id_proof: {
                    type: attachment.type,
                    path: attachment.path,
                },
            },
            $set: {
                m_dt: new Date()
            },
        });
        return result;
    } catch (error) {
        Log.error(TAG, 'addIdProof()', error);
        throw error;
    }
}

export async function deleteIdProof(loggedInUser: IUserSession, userId: string, type) {
    Log.debug('Started delete id proof');
    try {
        const result = await findOneAndUpdate(User, {
            _id: userId,
        }, {
            $pull: {
                id_proof: {
                    type: type
                },
            }
        });
        return result;
    } catch (error) {
        Log.error(TAG, 'addIdProof()', error);
        throw error;
    }
}

export async function getIdProofs(userId: string) {
    Log.debug('Started fetch id proofs');
    try {
        const result = await findOne(User, {
            _id: userId,
        }, {
            id_proof: 1,
        });
        return result?.id_proof;
    } catch (error) {
        Log.error(TAG, 'getIdProofs()', error);
        throw error;
    }
}

export async function getIdProofByType(userId: string, type: 1) {
    Log.debug('Started fetch id proofs');
    try {
        const result = await findOne(User, {
            '_id': userId,
            'id_proof.type': type,
        }, {
            id_proof: 1,
        });
        return result?.id_proof;
    } catch (error) {
        Log.error(TAG, 'getIdProofByType()', error);
        throw error;
    }
}

export async function updateIdProof(loggedInUser: IUserSession, userId: string, attachment: IAttachment) {
    Log.debug('Started adding id proof');
    try {
        const result = await findOneAndUpdate(User, {
            '_id': userId,
            'id_proof.type': attachment.type
        }, {
            $set: {
                'id_proof.$': {
                    type: attachment.type,
                    path: attachment.path,
                },
                'm_dt': new Date()
            },
        });
        return result;
    } catch (error) {
        Log.error(TAG, 'addIdProof()', error);
        throw error;
    }
}

export async function updateKyc(loggedInUser: IUserSession, userId: string, kyc: number) {
    try {
        return await findOneAndUpdate(User, {
            _id: userId,
        }, {
            kyc: kyc,
            m_dt: new Date(),
        }, {});
    } catch (error) {
        Log.error(TAG, 'updateKyc()', error);
        throw error;
    }
}

export async function updateOverAllStatus(loggedInUser: IUserSession, userId: string, status: number) {
    try {
        return await findOneAndUpdate(User, {
            _id: userId,
        }, {
            approved: status,
            m_dt: new Date(),
        }, {});
    } catch (error) {
        Log.error(TAG, 'updateOverAllStatus()', error);
        throw error;
    }
}

export async function updateTrainingCompletedStatus(loggedInUser: IUserSession, userId: string, status: number) {
    try {
        return await findOneAndUpdate(User, {
            _id: userId,
        }, {
            on_training: status,
            m_dt: new Date(),
        }, {});
    } catch (error) {
        Log.error(TAG, 'updateTrainingCompletedStatus()', error);
        throw error;
    }
}

export async function updateProfilePercentage(loggedInUser: IUserSession, userId: string, user: IUser) {
    try {
        return await findOneAndUpdate(User, {
            _id: userId,
        }, {
            profile_percent: user.profilePercentage,
            kyc: user.kycVerified,
            m_dt: new Date(),
        }, {});
    } catch (error) {
        Log.error(TAG, 'updateProfilePercentage()', error);
        throw error;
    }
}

export async function updateStatus(loggedInUser: IUserSession, userId: string, status: number) {
    try {
        return await findOneAndUpdate(User, {
            _id: Types.ObjectId(userId),
        }, {
            status: status,
            m_dt: new Date(),
        }, {});
    } catch (error) {
        Log.error(TAG, 'updateKyc()', error);
        throw error;
    }
}

export async function getInvitedUserById(id: string) {
    try {
        const user = await findOne(Invitation, {
            _id: id,
        }, {
            _id: 1,
            name: 1,
            email: 1,
            status: 1,
            role_obj: 1,
        }, {});
        return user;
    } catch (error) {
        Log.error(TAG, 'getInvitedUser()', error);
        throw error;
    }
}

export async function getInvitedUserByEmail(emailId: string) {
    try {
        const user = await findOne(Invitation, {
            email: emailId,
            status: STATUS_LIST['4'].id,
        }, {
            _id: 1,
            name: 1,
            email: 1,
            status: 1,
            role_obj: 1,
        }, {});
        return user;
    } catch (error) {
        Log.error(TAG, 'getInvitedUserByEmail()', error);
        throw error;
    }
}

export async function saveInvitedUserData(loggedInUser: IUserSession, payload: any) {
    try {
        const invitation = new Invitation({
            name: payload.name ?? null,
            email: payload?.emailId ?? null,
            role_obj: payload?.role ?? null,
            c_dt: new Date(),
            m_dt: new Date(),
            status: STATUS_LIST['4'].id,
        });
        await invitation.save();
        const result = await Invitation.populate(invitation, populatePaths);
        return result;
    } catch (error) {
        Log.error(TAG, 'saveInvitedUserData()', error);
        throw error;
    }
}

export async function saveSharedReport(loggedInUser: IUserSession, payload: any) {
    try {
        const shareReport = new ShareReport({
            u_obj: payload.name ?? null,
            email: payload?.emailId ?? null,
            report_uri: payload?.reportURI ?? null,
            c_dt: new Date(),
            m_dt: new Date(),
        });
        Log.info("shareReport save: ", shareReport)
        await shareReport.save();
        const result = await ShareReport.populate(shareReport, populatePaths);
        return result;
    } catch (error) {
        Log.error(TAG, 'saveInvitedUserData()', error);
        throw error;
    }
}

export async function updateInvitedUserStatus(id: string, status: number) {
    try {
        return await findOneAndUpdate(Invitation, {
            _id: id,
        }, {
            status: status,
        });
    } catch (error) {
        Log.error(TAG, 'updateInvitedUserStatus()', error);
        throw error;
    }
}

export async function fetchUserEmailsByRole(role: string) {
    try {
        const result = await findAllRecords(User, {
            role_obj: role,
        }, {
            email: 1,
        }, {});
        const emails: string[] = [];
        for (const email of result) {
            emails.push(email.email);
        }
        return emails;
    } catch (error) {
        Log.error(TAG, 'fetchUsersByRole()', error);
        throw error;
    }
}

/*export async function updateUserActions(userId: string, action: string) {
    try {
        switch (action) {
            case 'ASSESSMENT':
                await findOneAndUpdate(User, {_id: userId}, {assessment: 1}, {}, []);
                break;
            // case 'ONLINE_TRAINING'
            //     await findOneAndUpdate(User, {_id: userId}, {assessment: 1}, {}, []);
        }
    } catch (error) {
        Log.error(TAG, 'updateUserActions()', error);
        throw error;
    }
}*/

export async function fetchUserProfileImage(userId: string): Promise<string> {
    try {
        const result = await findOne(User, {
            _id: userId,
        }, {
            pic: 1,
        }, {});
        return result?.pic;
    } catch (error) {
        Log.error(TAG, 'fetchUserProfileImage()', error);
        throw error;
    }
}