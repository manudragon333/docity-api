import {
  APIError,
  EmailRecipient,
  EmailSender,
  IServiceResponse,
  IUser,
  IUserSession,
  Log,
  ServiceResponse,
  UserSession,
} from "models";
import { HttpStatusCodes } from "constants/status_codes";
import { ErrorCodes } from "constants/error_constants";
import {
  comparePasswords,
  decryptString,
  encryptString,
  hashPassword,
} from "helpers/encryption";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "helpers/authentication";
import { AuthData, UserData } from "data_stores/mongo_db";
import { fetchRoleByName } from "data_stores/mongo_db/cache/role";
import { ROLE_LIST, STATUS_LIST } from "constants/master_data";
import { loadTemplates } from "loaders/template";
import { sendEmail } from "helpers/email";
import { REDIRECT_URLS, SENDER_EMAIL_ID } from "loaders/config";
import {
  getInvitedUserById,
  updateInvitedUserStatus,
} from "data_stores/mongo_db/lib/user";
import mongoose from "mongoose";
import { checkDuplicateEmail } from "data_stores/mongo_db/lib/auth";

const TAG = "services.loginUser";

export async function loginUser(payload: any) {
  Log.info(TAG + ".loginUser()1");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Login success.",
    true,
    {}
  );
  let { userName, password } = payload;
  try {
    userName = userName?.toLowerCase();
    Log.info("userName = " + userName);
    const user: IUser = await AuthData.fetchUserDetails(userName);
    Log.info("user = " + JSON.stringify(user));
    if (!user) {
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      serviceResponse.message = "Invalid userName.";
      serviceResponse.addError(
        new APIError("Invalid userName.", ErrorCodes.UNAUTHORIZED, "")
      );
      return serviceResponse;
    }
    if (user.status === STATUS_LIST["0"].id) {
      Log.info("user.status = " + user.status);
      Log.info("STATUS_LIST['0'].id = " + STATUS_LIST["0"].id);
      if (user.role.filter((role) => role.name == ROLE_LIST.USER.name).length) {
        serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
        serviceResponse.message = "Please verify your mail.";
        serviceResponse.addError(
          new APIError(
            "Mail is not verified.",
            ErrorCodes.VERIFICATION_FAILED,
            "userName"
          )
        );
        return serviceResponse;
      } else {
        serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
        serviceResponse.message =
          "Your account is suspended. Please get in touch with admin.";
        serviceResponse.addError(
          new APIError(
            "Account suspended.",
            ErrorCodes.UNAUTHORIZED,
            "userName"
          )
        );
        return serviceResponse;
      }
    }
    const passwordMatched = await comparePasswords(user.password, password);
    if (passwordMatched) {
      delete user.password;
      const accessToken = await generateAccessToken({
        userId: user?.id,
        role: user.role,
        name: user.fullName,
      });
      const refreshToken = await generateRefreshToken({
        userId: user?.id,
        role: user.role,
        name: user.fullName,
      });
      serviceResponse.data = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user,
      };
    } else {
      serviceResponse.statusCode = HttpStatusCodes.UNAUTHORIZED;
      serviceResponse.message = "Invalid credentials.";
      serviceResponse.addError(
        new APIError(
          "Invalid credentials..",
          ErrorCodes.UNAUTHORIZED,
          "password"
        )
      );
      return serviceResponse;
    }
  } catch (error) {
    Log.error(TAG, "loginUser() error", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("login", "user")
    );
  }
  return serviceResponse;
}

export async function registerUser(user: IUser) {
  Log.info(TAG + ".registerUser()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "A verification link has been sent to your email. Click the link to finish sign up process.",
    true,
    {}
  );
  try {
    user.emailId = user.emailId.toLowerCase();
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
      user.password = await hashPassword(user.password);
      const userRole = await fetchRoleByName(ROLE_LIST.USER.name);
      user.role = [userRole.id];
      user.status = STATUS_LIST["0"].id;
      const savedUser: IUser = await AuthData.saveUser(user);
      const compiledTemplates = await loadTemplates();
      const inviteMail = compiledTemplates.VERIFY_USER;
      const token = encryptString(
        JSON.stringify({
          id: savedUser.id,
        })
      );
      const mailBody = inviteMail({
        redirectUrl:
          REDIRECT_URLS.VERIFY_USER + `/?tk=${encodeURIComponent(token)}`,
      });
      sendEmail(
        new EmailSender(SENDER_EMAIL_ID),
        new EmailRecipient([user.emailId]),
        "ALERT: VERIFY ACCOUNT",
        mailBody
      ).catch((error) => {
        Log.error(TAG, "sendEmail()", error);
      });
    }
  } catch (error) {
    Log.error(TAG, "registerUser()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("register", "user")
    );
  }
  return serviceResponse;
}

export async function forgetPassword(payload: any) {
  Log.info(TAG + ".forgetPassword()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Sent reset password instruction to your email.",
    true,
    {}
  );
  let { userName } = payload;
  try {
    userName = userName?.toLowerCase();
    const user: IUser = await AuthData.fetchUserDetails(userName);
    if (!user) {
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      serviceResponse.message = "Invalid userName.";
      serviceResponse.addError(
        new APIError("Invalid userName.", ErrorCodes.UNAUTHORIZED, "userName")
      );
      return serviceResponse;
    }
    const refreshToken = await generateRefreshToken(
      {
        userId: user?.id,
      },
      30 * 60
    );

    const compiledTemplates = await loadTemplates();
    const inviteMail = compiledTemplates.RESET_PASSWORD;
    const mailBody = inviteMail({
      redirectUrl:
        REDIRECT_URLS.RESET_PASSWORD +
        `?token=${encodeURIComponent(refreshToken)}&type=forgotpwd`,
    });
    sendEmail(
      new EmailSender(SENDER_EMAIL_ID),
      new EmailRecipient([user.emailId]),
      "ALERT: RESET PASSWORD",
      mailBody
    ).catch((error) => {
      Log.error(TAG, "sendEmail()", error);
    });
  } catch (error) {
    Log.error(TAG, "forgetPassword()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("reset", "password")
    );
  }
  return serviceResponse;
}

export async function resetPassword(payload: any) {
  Log.info(TAG + ".resetPassword()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully updated the password.",
    true,
    {}
  );
  const { token, password } = payload;
  try {
    const decode = await verifyRefreshToken(token);
    const hashedPassword = await hashPassword(password);
    await UserData.updatePassword(
      {} as UserSession,
      decode.userId,
      hashedPassword
    );
  } catch (error) {
    Log.error(TAG, "resetPassword()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("reset", "password")
    );
  }
  return serviceResponse;
}

export async function verifyUser(token: string) {
  Log.info(TAG + ".verifyUser()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "A verification link has been sent to your email. Click the link to finish sign up process.",
    true,
    {}
  );
  try {
    const user: any = JSON.parse(await decryptString(token));
    await UserData.updateStatus(
      {} as IUserSession,
      user.id,
      STATUS_LIST["1"].id
    );
  } catch (error) {
    Log.error(TAG, "verifyUser()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("verify", "user")
    );
  }
  return serviceResponse;
}

export async function resendVerificationLink(userName: string) {
  Log.info(TAG + ".resendVerificationLink()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Sent verification link to your email.",
    true,
    {}
  );
  try {
    userName = userName?.toLowerCase();
    const user: IUser = await AuthData.fetchUserDetails(userName);
    if (!user) {
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      serviceResponse.message = "Invalid userName.";
      serviceResponse.addError(
        new APIError("Invalid userName.", ErrorCodes.UNAUTHORIZED, "userName")
      );
      return serviceResponse;
    }
    if (user.status == STATUS_LIST["0"].id) {
      const compiledTemplates = await loadTemplates();
      const inviteMail = compiledTemplates.VERIFY_USER;
      const token = encryptString(
        JSON.stringify({
          id: user.id,
        })
      );
      Log.debug("TOKEN: " + token);
      const mailBody = inviteMail({
        redirectUrl:
          REDIRECT_URLS.VERIFY_USER + `/?tk=${encodeURIComponent(token)}`,
      });
      sendEmail(
        new EmailSender(SENDER_EMAIL_ID),
        new EmailRecipient([user.emailId]),
        "ALERT: VERIFY ACCOUNT",
        mailBody
      ).catch((error) => {
        Log.error(TAG, "sendEmail()", error);
      });
    }
  } catch (error) {
    Log.error(TAG, "resendVerificationLink()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("resend verification link", "")
    );
  }
  return serviceResponse;
}

export async function verifyInviteUser(token: string) {
  Log.info(TAG + ".verifyInviteUser()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Successfully verified user.",
    true,
    {}
  );
  try {
    const decodedToken: any = JSON.parse(await decryptString(token));
    const user = await UserData.getInvitedUserById(decodedToken.id);
    if (user) {
      serviceResponse.data = {
        name: user.name,
        emailId: user.email,
        token: await encryptString(
          JSON.stringify({
            id: decodedToken.id,
            verified: 1,
          })
        ),
      };
    } else {
      serviceResponse.statusCode = HttpStatusCodes.FORBIDDEN;
      serviceResponse.message = "Access forbidden.";
      serviceResponse.addError(
        new APIError("Access forbidden.", ErrorCodes.FORBIDDEN, "token")
      );
    }
  } catch (error) {
    Log.error(TAG, "verifyInviteUser()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("failed to verify token", "")
    );
  }
  return serviceResponse;
}

export async function saveInvitedUserDetails(user: IUser, token: string) {
  Log.info(TAG + ".saveInvitedUserDetails()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Registration successful.",
    true,
    {}
  );
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const decodedToken = JSON.parse(await decryptString(token));
    if (decodedToken.verified) {
      const invite = await getInvitedUserById(decodedToken.id);
      if (
        invite.email == user.emailId &&
        invite.status != STATUS_LIST["12"].id
      ) {
        user.emailId = user.emailId.toLowerCase();
        const duplicateEmail = await checkDuplicateEmail(user.emailId);
        if (duplicateEmail) {
          serviceResponse.message = "Already registered!!";
          serviceResponse.statusCode = HttpStatusCodes.FORBIDDEN;
          serviceResponse.addError(
            new APIError("Already registered!!", ErrorCodes.FORBIDDEN, "email")
          );
        } else {
          user.password = await hashPassword(user.password);
          user.role = [invite.role_obj];
          user.status = STATUS_LIST["0"].id;
          const result = await AuthData.saveUser(user);
          await updateInvitedUserStatus(invite._id, STATUS_LIST["12"].id);
          delete result.password;
          const accessToken = await generateAccessToken({
            userId: result?.id,
            role: result.role,
            name: result.fullName,
          });
          const refreshToken = await generateRefreshToken({
            userId: result?.id,
            role: result.role,
            name: result.fullName,
          });
          serviceResponse.data = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: result,
          };
          const compiledTemplates = await loadTemplates();
          const inviteMail = compiledTemplates.VERIFY_USER;
          const tk = encryptString(
            JSON.stringify({
              id: result.id,
            })
          );
          const mailBody = inviteMail({
            redirectUrl:
              REDIRECT_URLS.VERIFY_USER + `/?tk=${encodeURIComponent(tk)}`,
          });
          sendEmail(
            new EmailSender(SENDER_EMAIL_ID),
            new EmailRecipient([user.emailId]),
            "ALERT: VERIFY ACCOUNT",
            mailBody
          ).catch((error) => {
            Log.error(TAG, "sendEmail()", error);
          });
        }
      } else {
        if (invite.status == STATUS_LIST["12"].id) {
          serviceResponse.message = "Already registered!!";
          serviceResponse.statusCode = HttpStatusCodes.FORBIDDEN;
          serviceResponse.addError(
            new APIError("Already registered!!", ErrorCodes.FORBIDDEN, "email")
          );
        } else {
          serviceResponse.message = "Invalid EmailID!!";
          serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
          serviceResponse.addError(
            new APIError(
              "Invalid EmailID!!",
              ErrorCodes.VALIDATION_ERROR,
              "email"
            )
          );
        }
      }
    } else {
      serviceResponse.message = "Access forbidden";
      serviceResponse.statusCode = HttpStatusCodes.FORBIDDEN;
      serviceResponse.addError(
        new APIError("Access forbidden", ErrorCodes.FORBIDDEN, "token")
      );
    }
  } catch (error) {
    Log.error(TAG, "saveInvitedUserDetails()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("Save user", "")
    );
  }
  if (serviceResponse?.errors?.length) {
    Log.debug("ROLLBACK");
    await session.abortTransaction();
  } else {
    Log.debug("COMMIT");
    await session.commitTransaction();
  }
  session?.endSession();
  return serviceResponse;
}

export async function refreshSession(refreshToken: string) {
  Log.info(TAG + ".refreshSession()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Refresh session is done.",
    false,
    {}
  );
  try {
    const decode: any = verifyRefreshToken(refreshToken);
    serviceResponse.data = {
      accessToken: generateAccessToken({
        userId: decode?.id,
        role: decode.role,
        name: decode.name,
      }),
      refreshToken: refreshToken,
    };
    const diffMs =
      (new Date(decode.exp * 1000).getTime() - new Date().getTime()) / 1000;
    const diffMins = diffMs / 60;
    if (diffMins <= 60) {
      serviceResponse.data.refreshToken = generateRefreshToken({
        userId: decode?.id,
        role: decode.role,
        name: decode.name,
      });
    }
  } catch (error) {
    Log.error(TAG, "refreshSession()", error);
    serviceResponse.message = "Invalid Token!";
    serviceResponse.addError(
      new APIError("Access Forbidden", ErrorCodes.UNAUTHORIZED, "refreshToken")
    );
  }
  return serviceResponse;
}

export async function checkEmailAlreadyRegistered(emailId: string) {
  Log.info(TAG + ".checkEmailAlreadyRegistered()");
  const serviceResponse: IServiceResponse = new ServiceResponse(
    HttpStatusCodes.OK,
    "Valid Email.",
    true,
    {}
  );
  try {
    emailId = emailId.toLowerCase();
    const duplicateEmail = await checkDuplicateEmail(emailId);
    if (duplicateEmail) {
      serviceResponse.message = "Email already registered.";
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
      serviceResponse.addError(
        new APIError(
          "Email already registerd.",
          ErrorCodes.RESOURCE_ALREADY_EXIST,
          "email"
        )
      );
    }
  } catch (error) {
    Log.error(TAG, "checkEmailAlreadyRegistered()", error);
    serviceResponse.addServerError(
      serviceResponse.buildServiceFailedMessage("validate email")
    );
  }
  return serviceResponse;
}
