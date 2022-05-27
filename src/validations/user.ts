import { NextFunction, Response } from "express";
import { Log } from "models";
import * as Joi from "joi";
import { ErrorMessages } from "constants/error_constants";
import { buildErrorMessage } from "utils/string";
import {
  baseQueryListValidation,
  mobileNumberValidation,
  validate,
  validate2,
} from "validations/common";
import { ROLE_LIST, USER_DOC_TYPES } from "constants/master_data";

const TAG = "validations.user";

export function doNothing(req, res, next) {
  next();
}

export function userSchema() {
  return Joi.object().keys({
    firstName: Joi.string()
      .min(3)
      .max(125)
      .required()
      .messages({
        "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
          $field: "First name",
        }),
        "string.min": buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
          $field: "First name",
          $length: "3",
        }),
        "string.max": buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
          $field: "First name",
          $length: "3",
        }),
      }),
    lastName: Joi.string().allow("", null),
    emailId: Joi.string()
      .email()
      .required()
      .messages({
        "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
          $field: "Email",
        }),
        "string.pattern": buildErrorMessage(ErrorMessages.INVALID_EMAIL, {
          $field: "Email",
        }),
      }),
    mobileNumber: mobileNumberValidation()
      .allow("", null)
      .messages({
        "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
          $field: "Contact number",
        }),
        "string.min": buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
          $field: "Contact number",
          $length: "10",
        }),
        "string.pattern": buildErrorMessage(ErrorMessages.INVALID_FIELD, {
          $field: "Contact number",
        }),
      }),
    currentAddress: Joi.string()
      .min(1)
      .max(512)
      .allow(null, "")
      .messages({
        "string.min": buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
          $field: "Current address",
          $length: "1",
        }),
        "string.max": buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
          $field: "Current address",
          $length: "512",
        }),
      }),
    permanentAddress: Joi.string()
      .min(1)
      .max(512)
      .allow(null, "")
      .messages({
        "string.min": buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
          $field: "Permanent address",
          $length: "1",
        }),
        "string.max": buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
          $field: "Permanent address",
          $length: "512",
        }),
      }),
    age: Joi.number().integer().allow(null),
    dob: Joi.string().allow(null, ""),
    qualification: Joi.string().allow(null, ""),
    graduateFrom: Joi.string().allow(null, ""),
    graduationYear: Joi.number().integer().allow(null),
    role: Joi.array()
      .min(0)
      .items(
        Joi.object().keys({
          id: Joi.string()
            .required()
            .messages({
              "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
                $field: "Role ID",
              }),
            }),
        })
      )
      .messages({
        "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
          $field: "Role",
        }),
        "array.min": "Minimum one role is required",
      }),
    profileId: Joi.string().allow(null, ""),
    region: Joi.array()
      .min(0)
      .items(Joi.string())
      .messages({
        "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
          $field: "Region",
        }),
        "array.min": "Minimum one region is required",
      }),
  });
}

export async function saveUser(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".saveUser()");
  try {
    Log.debug("STARTED validation of save user request body");
    const schema = await userSchema();
    await validate(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "saveUser()", error);
    next(error);
  }
}

export async function getUsers(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".getUsers()");
  try {
    Log.debug("STARTED validation of get users.");
    let schema = baseQueryListValidation();
    schema = schema.append({
      roles: Joi.string(),
      status: Joi.string(),
    });
    await validate(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "getUsers()", error);
    next(error);
  }
}

export async function getCivilEngg(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".getUsers()");
  try {
    Log.debug("STARTED validation of get users.");
    let schema = baseQueryListValidation();
    schema = schema.append({
      status: Joi.string(),
      region: Joi.string().allow(null, ""),
    });
    await validate(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "getUsers()", error);
    next(error);
  }
}

export async function getUser(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".getUser()");
  try {
    Log.debug("STARTED validation of get user.");
    const schema = Joi.object().keys({
      userId: Joi.string()
        .required()
        .messages({
          "any.": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "User ID",
          }),
        }),
    });
    await validate(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "getUser()", error);
    next(error);
  }
}

export async function updateUser(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".updateUser()");
  try {
    Log.debug("STARTED validation of update user.");
    let schema = userSchema();
    schema = schema.append({
      userId: Joi.string()
        .required()
        .messages({
          "any.": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "User ID",
          }),
        }),
    });
    await validate(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "updateUser()", error);
    next(error);
  }
}

export async function updateProfileImage(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".updateProfileImage()");
  try {
    Log.debug("STARTED validation of update profile image.");
    const schema = Joi.object().keys({
      userId: Joi.string()
        .required()
        .messages({
          "any.": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "User ID",
          }),
        }),
      profileImage: Joi.string()
        .required()
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Profile image",
          }),
        }),
    });
    await validate(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "updateProfileImage()", error);
    next(error);
  }
}

export async function addAttachment(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".addAttachment()");
  try {
    Log.debug("STARTED validation of add attachment.");
    const schema = Joi.object().keys({
      userId: Joi.string()
        .required()
        .messages({
          "any.": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "User ID",
          }),
        }),
      type: Joi.string()
        .allow(...Object.keys(USER_DOC_TYPES))
        .required()
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Type",
          }),
        }),
      attachment: Joi.string()
        .required()
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Attachment",
          }),
        }),
    });
    await validate(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "addAttachment()", error);
    next(error);
  }
}

export async function handleUserAction(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".handleUserAction()");
  try {
    Log.debug("STARTED validation of update over all status.");
    const schema = Joi.object().keys({
      userId: Joi.string()
        .required()
        .messages({
          "any.": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "User ID",
          }),
        }),
      action: Joi.string()
        .required()
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Action",
          }),
        }),
    });
    await validate(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "handleUserAction()", error);
    next(error);
  }
}

export async function inviteUser(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".inviteUser()");
  try {
    Log.debug("STARTED validation of invite user request body");
    const schema = Joi.object().keys({
      name: Joi.string()
        .required()
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Name",
          }),
        }),
      emailId: Joi.string()
        .required()
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Email",
          }),
        }),
      role: Joi.string()
        .required()
        .valid(...Object.keys(ROLE_LIST))
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Role",
          }),
        }),
    });
    await validate(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "inviteUser()", error);
    next(error);
  }
}

export async function shareReport(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".shareReport()");
  try {
    Log.debug("STARTED validation of share report request body");
    const schema = Joi.object().keys({
      emailId: Joi.string()
        .required()
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Email",
          }),
        }),
      link: Joi.string()
        .required()
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Report_URI",
          }),
        }),
    });
    await validate2(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "shareReport()", error);
    next(error);
  }
}
