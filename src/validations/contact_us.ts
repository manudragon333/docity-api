import { NextFunction, Response } from "express";
import { Log } from "models";
import * as Joi from "joi";
import { ErrorMessages } from "constants/error_constants";
import { buildErrorMessage } from "utils/string";
import { validate2 } from "validations/common";
import { ROLE_LIST, USER_DOC_TYPES } from "constants/master_data";

const TAG = "validations.contact_us";

export async function contactUs(
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".contactUs()");
  try {
    Log.debug("STARTED validation of contact us request body");
    const schema = Joi.object().keys({
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
      lastName: Joi.string()
        .min(3)
        .max(125)
        .required()
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Last name",
          }),
          "string.min": buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
            $field: "Last name",
            $length: "3",
          }),
          "string.max": buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
            $field: "Last name",
            $length: "3",
          }),
        }),
      queryTypes: Joi.string().required(),
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
      mobileNumber: Joi.string()
        .min(10)
        .max(10)
        .required()
        .messages({
          "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
            $field: "Mobile Number",
          }),
          "string.min": buildErrorMessage(ErrorMessages.INVALID_MIN_LENGTH, {
            $field: "Mobile Number",
            $length: "10",
          }),
          "string.max": buildErrorMessage(ErrorMessages.INVALID_MAX_LENGTH, {
            $field: "Mobile Number",
            $length: "10",
          }),
        }),
      address: Joi.string().required(),
      message: Joi.string().required(),
    });
    await validate2(schema, req, res, next);
  } catch (error) {
    Log.error(TAG, "contactUs()", error);
    next(error);
  }
}
