import {
  APIError,
  Attachment,
  EmailRecipient,
  EmailSender,
  IServiceResponse,
  IUser,
  IUserSession,
  ListAPIResponse,
  Log,
  ServiceResponse,
} from "models";
import { HttpStatusCodes } from "constants/status_codes";
import { RoleData, UserData } from "data_stores/mongo_db";
import { encryptString, hashPassword } from "helpers/encryption";
import { ROLE_LIST, STATUS_LIST, USER_DOC_TYPES } from "constants/master_data";
import { ErrorCodes } from "constants/error_constants";
import { loadTemplates } from "loaders/template";
import { sendEmail } from "helpers/email";
import { AWS_S3, REDIRECT_URLS, SENDER_EMAIL_ID } from "loaders/config";
import { generateRefreshToken } from "helpers/authentication";
import { profileCalculation } from "helpers/user";
import { IUserListApiRequest } from "src/models/lib/api_requests/user_list_api_request";
import { fetchRoleByName } from "data_stores/mongo_db/cache/role";
import { UserActions } from "constants/api_actions";
import { saveFiles } from "helpers/s3_media";
import { PathParams } from "constants/api_params";

// import {userRequestBodyForeignKeyChecks} from 'helpers/foreign_key_checks/user';

const TAG = "services.user";

export async function saveUser(
  loggedInUser: IUserSession,
  user: IUser
): Promise<IServiceResponse> {
  Log.info(TAG + ".saveUser()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.CREATED,
    "Successfully saved user.",
    true
  );
  try {
    const emailExist = await UserData.checkDuplicateEmail(user.emailId);
    if (emailExist) {
      serviceResponse.message = "The email already registered.";
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      serviceResponse.addError(
        new APIError(
          "The email already registered.",
          ErrorCodes.RESOURCE_ALREADY_EXIST,
          "emailId"
        )
      );
    } else {
      user.password = await hashPassword(user.firstName);
      const role = await fetchRoleByName(ROLE_LIST.CIVIL_ENGINEER.name);
      user.role = [role.id];
      user.profilePercentage = profileCalculation(user);
      serviceResponse.data = await UserData.saveUser(loggedInUser, user);
      const compiledTemplates = await loadTemplates();
      const inviteMail = compiledTemplates.ADD_USER;
      const refreshToken = await generateRefreshToken(
        {
          userId: user?.id,
        },
        24 * 60 * 60
      );
      inviteMail.replace(
        "{{redirectUrl}",
        (process.env?.RESET_PASSWORD_URL ?? "#") + `?token=${refreshToken}`
      );
      sendEmail(
        new EmailSender(SENDER_EMAIL_ID),
        new EmailRecipient([user.emailId]),
        "INVITATION: Docity",
        inviteMail
      ).catch((error) => {
        Log.error(TAG, "sendEmail()", error);
      });
    }
  } catch (error) {
    Log.error(TAG, "saveUser()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("save", "user")
    );
  }
  return serviceResponse;
}

export async function getUsers(
  loggedInUser: IUserSession,
  queryParams: IUserListApiRequest
): Promise<IServiceResponse> {
  Log.info(TAG + ".getUsers()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully fetch users.",
    true
  );
  try {
    if (queryParams.roles.length) {
      const roles = await RoleData.fetchRoles();
      const matchedRoles = roles.filter(
        (role) => queryParams.roles.indexOf(role.name) !== -1
      );
      queryParams.roles = matchedRoles.map((role) => role.id);
    }
    const users = await UserData.fetchUsers(loggedInUser, queryParams);
    const userCount = await UserData.fetchUsersCount(loggedInUser, queryParams);
    serviceResponse.data = new ListAPIResponse(
      users,
      userCount > queryParams.limit,
      queryParams.offset,
      queryParams.limit,
      userCount,
      queryParams.sortBy,
      queryParams.sortOrder
    );
    // TODO Handle roles
  } catch (error) {
    Log.error(TAG, "getUsers()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("fetch", "users")
    );
  }
  return serviceResponse;
}

export async function getUserDetails(
  userId: string
): Promise<IServiceResponse> {
  Log.info(TAG + ".getUserDetails()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully fetch user details.",
    true
  );
  try {
    serviceResponse.data = await UserData.fetchUserDetails(userId);
    // TODO Handle roles
  } catch (error) {
    Log.error(TAG, "getUserDetails()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("fetch", "user")
    );
  }
  return serviceResponse;
}

export async function updateUser(
  loggedInUser: IUserSession,
  user: IUser
): Promise<IServiceResponse> {
  Log.info(TAG + ".updateUser()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.CREATED,
    "Successfully updated user.",
    true
  );
  try {
    const userExist = await UserData.fetchUserDetails(user.id);
    if (userExist) {
      user.emailId = user.emailId?.toLowerCase();
      const emailExist = await UserData.checkDuplicateEmail(
        user.emailId,
        user.id
      );
      if (emailExist) {
        serviceResponse.message = "The email already registered.";
        serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
        serviceResponse.addError(
          new APIError(
            "The email already registered.",
            ErrorCodes.RESOURCE_ALREADY_EXIST,
            "emailId"
          )
        );
      } else {
        await UserData.updateUser(loggedInUser, user);
        // TODO: Handle user role
        const updateduser: IUser = await UserData.fetchUserDetails(user.id);
        updateduser.profilePercentage = profileCalculation(updateduser);
        if (updateduser.profilePercentage == 100) {
          updateduser.kycVerified = STATUS_LIST["6"].id;
        } else {
          updateduser.kycVerified = STATUS_LIST["4"].id;
        }
        await UserData.updateProfilePercentage(
          loggedInUser,
          user.id,
          updateduser
        );
        serviceResponse.data = updateduser;
      }
    } else {
      serviceResponse.statusCode = HttpStatusCodes.NOT_FOUND;
      serviceResponse.message = "User Not found!";
      serviceResponse.addError(
        new APIError(
          "User not found!!",
          ErrorCodes.RESOURCE_NOT_FOUND,
          "userId"
        )
      );
    }
  } catch (error) {
    Log.error(TAG, "updateUser()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("update", "user")
    );
  }
  return serviceResponse;
}

export async function updateProfileImage(req: any, res: any) {
  Log.info(TAG + ".updateProfileImage()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully updated profile image.",
    true
  );
  try {
    const userId = req.params[PathParams.USER_ID] ?? req.userSession.userId;
    const userExist = await UserData.fetchUserDetails(userId);
    if (userExist) {
      const result: any = await saveFiles(req, res, AWS_S3.userBucket, true);
      for (const file of result?.files ?? []) {
        if (file.path) {
          file.path = file?.path[0] == "/" ? file.path : "/" + file?.path;
        }
        await UserData.updateProfileImage(
          req.userSession,
          userId,
          file?.location ?? file.path
        );
        const updateduser: IUser = await UserData.fetchUserDetails(userId);
        updateduser.profilePercentage = profileCalculation(updateduser);
        if (updateduser.profilePercentage == 100) {
          updateduser.kycVerified = STATUS_LIST["6"].id;
        } else {
          updateduser.kycVerified = STATUS_LIST["4"].id;
        }
        await UserData.updateProfilePercentage(
          req.userSession,
          userId,
          updateduser
        );
        serviceResponse.data = updateduser;
      }
    } else {
      serviceResponse.statusCode = HttpStatusCodes.NOT_FOUND;
      serviceResponse.message = "User Not found!";
      serviceResponse.addError(
        new APIError(
          "User not found!!",
          ErrorCodes.RESOURCE_NOT_FOUND,
          "userId"
        )
      );
    }
  } catch (error) {
    Log.error(TAG, "updateMyProfileImage()", error);
    serviceResponse.addServerError(
      "Failed to update the profile image due to technical issues."
    );
  }
  return serviceResponse;
}

export async function addUserIdProof(
  loggedInUser: IUserSession,
  userId: string,
  payload: any,
  files: any[]
) {
  Log.info(TAG + ".addUserIdProof()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully added id proof.",
    true
  );
  try {
    const userExist = await UserData.fetchUserDetails(userId);
    if (userExist) {
      const attachment = new Attachment(
        USER_DOC_TYPES[payload?.type].name,
        payload?.attachment
      );
      const duplicateIdProof = await UserData.getIdProofByType(
        userId,
        USER_DOC_TYPES[payload?.type].name
      );
      for (const file of files) {
        attachment.path = file.location;
        if (duplicateIdProof) {
          await UserData.updateIdProof(loggedInUser, userId, attachment);
        } else {
          await UserData.addIdProof(loggedInUser, userId, attachment);
        }
      }
      const updateduser: IUser = await UserData.fetchUserDetails(userId);
      updateduser.profilePercentage = profileCalculation(updateduser);
      if (updateduser.profilePercentage == 100) {
        updateduser.kycVerified = STATUS_LIST["6"].id;
      } else {
        updateduser.kycVerified = STATUS_LIST["4"].id;
      }
      await UserData.updateProfilePercentage(loggedInUser, userId, updateduser);
      serviceResponse.data = updateduser;
    } else {
      serviceResponse.statusCode = HttpStatusCodes.NOT_FOUND;
      serviceResponse.message = "User Not found!";
      serviceResponse.addError(
        new APIError(
          "User not found!!",
          ErrorCodes.RESOURCE_NOT_FOUND,
          "userId"
        )
      );
    }
  } catch (error) {
    Log.error(TAG, "addUserIdProof()", error);
    serviceResponse.addServerError(
      "Failed to add id proof due to technical issues."
    );
  }
  return serviceResponse;
}

export async function deleteUserIdProof(
  loggedInUser: IUserSession,
  userId: string,
  type: string
) {
  Log.info(TAG + ".deleteUserIdProof()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully added id proof.",
    true
  );
  try {
    await UserData.deleteIdProof(loggedInUser, userId, USER_DOC_TYPES[type]);
  } catch (error) {
    Log.error(TAG, "deleteMyIdProof()", error);
    serviceResponse.addServerError(
      "Failed to delete id proof due to technical issues."
    );
  }
  return serviceResponse;
}

export async function getIdProofs(userId: string) {
  Log.info(TAG + ".getIdProofs()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully fetched id proof.",
    false
  );
  try {
    serviceResponse.data = await UserData.getIdProofs(userId);
  } catch (error) {
    Log.error(TAG, "getIdProofs()", error);
    serviceResponse.addServerError(
      "Failed to get id proof due to technical issues."
    );
  }
  return serviceResponse;
}

export async function inviteUser(
  loggedInUser: IUserSession,
  payload: any,
  role: string
) {
  Log.info(TAG + ".inviteUser()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully invited user.",
    false
  );
  try {
    let { emailId, name } = payload;
    const emailExist = await UserData.checkDuplicateEmail(emailId);
    emailId = emailId?.toLowerCase();
    if (emailExist) {
      serviceResponse.message = "The email already registered.";
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      serviceResponse.addError(
        new APIError(
          "The email already registered.",
          ErrorCodes.RESOURCE_ALREADY_EXIST,
          "emailId"
        )
      );
    } else {
      // Todo handle invited user
      if (ROLE_LIST[role]) {
        const roleObj = await fetchRoleByName(ROLE_LIST[role].name);
        const result = await UserData.saveInvitedUserData(loggedInUser, {
          name: name,
          emailId: emailId,
          role: roleObj.id,
        });
        const compiledTemplates = await loadTemplates();
        const inviteMail = compiledTemplates.INVITATION;
        const token = encryptString(
          JSON.stringify({
            id: result._id,
          })
        );
        const mailBody = inviteMail({
          redirectUrl:
            REDIRECT_URLS.CE_REGESTER_PAGE +
            `/?token=${encodeURIComponent(token)}&type=CE`,
        });
        sendEmail(
          new EmailSender(SENDER_EMAIL_ID),
          new EmailRecipient([emailId]),
          "INVITATION FROM DOCITY",
          mailBody
        ).catch((error) => {
          Log.error(TAG, "sendEmail()", error);
        });
      } else {
        serviceResponse.message = "Invalid role invitation.";
        serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
        serviceResponse.addError(
          new APIError(
            "Invalid role invitation.",
            ErrorCodes.RESOURCE_ALREADY_EXIST,
            "role"
          )
        );
      }
    }
  } catch (error) {
    Log.error(TAG, "inviteUser()", error);
    serviceResponse.addServerError(
      "Failed to verify kyc due to technical issues."
    );
  }
  return serviceResponse;
}

export async function handleUserAction(
  loggedInUser: IUserSession,
  userId: string,
  action: string
) {
  Log.info(TAG + ".handleUserStatus()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully updated user status.",
    false
  );
  try {
    const actions = Object.keys(UserActions);
    switch (action) {
      case actions[0]:
        await UserData.updateStatus(loggedInUser, userId, STATUS_LIST["1"].id);
        break;
      case actions[1]:
        await UserData.updateStatus(loggedInUser, userId, STATUS_LIST["0"].id);
        break;
      case actions[2]:
        await UserData.updateStatus(loggedInUser, userId, STATUS_LIST["16"].id);
        break;
      case actions[3]:
        await UserData.updateOverAllStatus(
          loggedInUser,
          userId,
          STATUS_LIST["15"].id
        );
        break;
      case actions[4]:
        await UserData.updateKyc(loggedInUser, userId, STATUS_LIST["8"].id);
        break;
      case actions[5]:
        await UserData.updateKyc(loggedInUser, userId, STATUS_LIST["9"].id);
        break;
      case actions[6]:
        await UserData.updateTrainingCompletedStatus(
          loggedInUser,
          userId,
          STATUS_LIST["6"].id
        );
        break;
      case actions[7]:
        await UserData.updateOverAllStatus(
          loggedInUser,
          userId,
          STATUS_LIST["13"].id
        );
        break;
      default:
        serviceResponse.message = "Invalid action";
        serviceResponse.addError(
          new APIError("Invalid action!", ErrorCodes.VALIDATION_ERROR, "action")
        );
        serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
    }
  } catch (error) {
    Log.error(TAG, "handleUserAction()", error);
    serviceResponse.addServerError(
      "Failed to handle user action due to technical issues."
    );
  }
  return serviceResponse;
}

export async function getUserProfileImage(userId: string) {
  Log.info(TAG + ".handleUserStatus()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully fetched user profile Image.",
    false
  );
  try {
    serviceResponse.data = await UserData.fetchUserProfileImage(userId);
  } catch (error) {
    Log.error(TAG, "getUserProfileImage()", error);
    serviceResponse.addServerError(
      "Failed to handle user action due to technical issues."
    );
  }
  return serviceResponse;
}

export async function shareReport(
  loggedInUser: IUserSession,
  payload: any,
  role: string,
  userId: string
) {
  Log.info(TAG + ".shareReport()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Report sent Successfully.",
    false
  );
  try {
    let { emailId, link } = payload;
    emailId = emailId?.toLowerCase();
    // Todo handle invited user
    if (userId && role) {
      const user = await UserData.fetchUserDetails(userId);
      const result = await UserData.saveSharedReport(loggedInUser, {
        name: user.id,
        emailId: emailId,
        reportURI: link,
      });
      const compiledTemplates = await loadTemplates();
      const shareReportMail = compiledTemplates.SHARE_REPORT;
      const mailBody = shareReportMail({
        redirectUrl: link,
        userName: user.fullName,
        mobileNumber: user.mobileNumber,
        emailId: user.emailId
      });
      sendEmail(
        new EmailSender(SENDER_EMAIL_ID),
        new EmailRecipient([emailId]),
        "INVITATION FROM DOCITY",
        mailBody
      ).catch((error) => {
        Log.error(TAG, "sendEmail()", error);
      });
    } else {
          serviceResponse.message = 'Invalid User.';
          serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
          serviceResponse.addError(new APIError('Invalid User.',
              ErrorCodes.RESOURCE_ALREADY_EXIST, 'role'));
      }
  } catch (error) {
    Log.error(TAG, "shareReport()", error);
    serviceResponse.addServerError(
      "Failed to verify kyc due to technical issues."
    );
  }
  return serviceResponse;
}
