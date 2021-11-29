import { NextFunction } from "express";
import { Log } from "models";
import * as Joi from "joi";
import { idValidation, validate } from "validations/common";
import { buildErrorMessage } from "utils/string";
import { ErrorMessages } from "constants/error_constants";

const TAG = "validations.assessment_question";

export async function submitAssessment(
  req: any,
  res: any,
  next: NextFunction
): Promise<void> {
  Log.info(TAG + ".validtaeRequest()");
  try {
    Log.debug("Started validating assessment answered request");
    const schema = Joi.object().keys({
      assessment: Joi.array().items({
        question: idValidation("questionID")
          .required()
          .messages({
            "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
              $field: "Question",
            }),
          }),
        answer: Joi.string()
          .required()
          .messages({
            "any.required": buildErrorMessage(ErrorMessages.IS_REQUIRED, {
              $field: "Answer",
            }),
          }),
      }),
    });
    await validate(schema, req, res, next);
  } catch (e) {
    Log.error(TAG, "Error while validating assessment request()", e);
    throw e;
  }
}
