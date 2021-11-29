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
import { RoleData, UserData, ContactUsData } from "data_stores/mongo_db";
import { encryptString, hashPassword } from "helpers/encryption";
import { ROLE_LIST, STATUS_LIST, USER_DOC_TYPES } from "constants/master_data";
import { ErrorCodes } from "constants/error_constants";
import { loadTemplates } from "loaders/template";
import { sendEmail } from "helpers/email";
import { SENDER_EMAIL_ID, CONTACT_US_RECIPIENT_EMAIL_ID } from "loaders/config";
import { generateRefreshToken } from "helpers/authentication";
import { profileCalculation } from "helpers/user";
import { IUserListApiRequest } from "src/models/lib/api_requests/user_list_api_request";
import { fetchRoleByName } from "data_stores/mongo_db/cache/role";
import { UserActions } from "constants/api_actions";
import { saveFiles } from "helpers/s3_media";
import { PathParams } from "constants/api_params";

// import {userRequestBodyForeignKeyChecks} from 'helpers/foreign_key_checks/user';

const TAG = "services.contact_us";

export async function contactUs(payload: any) {
  Log.info(TAG + ".contactUs()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Contact Us saved Successfully.",
    false
  );
  try {
    let {
      firstName,
      lastName,
      queryTypes,
      emailId,
      mobileNumber,
      address,
      message,
    } = payload;
    emailId = emailId?.toLowerCase();
    // Todo handle invited user
    if (payload) {
      const result = await ContactUsData.saveContactUs({
        firstName: firstName,
        lastName: lastName,
        queryTypes: queryTypes,
        emailId: emailId,
        mobileNumber: mobileNumber,
        address: address,
        message: message,
      });
      const compiledTemplates = await loadTemplates();
      const contactUsMail = compiledTemplates.ADD_CONTACT_US;
      const mailBody = contactUsMail({
        firstName: firstName,
        lastName: lastName,
        queryTypes: queryTypes,
        emailId: emailId,
        mobileNumber: mobileNumber,
        address: address,
        message: message,
      });
      sendEmail(
        new EmailSender(SENDER_EMAIL_ID),
        new EmailRecipient([CONTACT_US_RECIPIENT_EMAIL_ID]),
        "CONTACT REQUEST",
        mailBody
      ).catch((error) => {
        Log.error(TAG, "sendEmail()", error);
      });
    } else {
      serviceResponse.message = "Invalid User.";
      serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
      serviceResponse.addError(
        new APIError("Invalid User.", ErrorCodes.RESOURCE_ALREADY_EXIST, "role")
      );
    }
  } catch (error) {
    Log.error(TAG, "contactUs()", error);
    serviceResponse.addServerError(
      "Failed to verify kyc due to technical issues."
    );
  }
  return serviceResponse;
}
