import { NextFunction, Response } from "express";
import { APIError, Log, ServiceResponse } from "models";
import { ROLE_LIST } from "constants/master_data";
import { HttpStatusCodes } from "constants/status_codes";
import { ErrorCodes } from "constants/error_constants";
import { responseBuilder } from "helpers/response_builder";
import { UserActions } from "constants/api_actions";
import { PathParams } from "constants/api_params";

const TAG = "middlewares.permission";

export function isSuperAdmin(req: any, res: Response, next: NextFunction) {
  try {
    const roleNames = req.userSession.role.map((role) => role.name);
    if (roleNames?.indexOf(ROLE_LIST.SUPER_ADMIN.name) !== -1) {
      next();
    } else {
      const response = new ServiceResponse(
        HttpStatusCodes.FORBIDDEN,
        "Access Denied.",
        null,
        true,
        [new APIError("Access Denied.", ErrorCodes.FORBIDDEN, "jwtToken")]
      );
      return responseBuilder(response, res, next, req);
    }
  } catch (error) {
    Log.error(TAG, "isSuperAdmin()", error);
    next(error);
  }
}

export function isCivilEngineer(req: any, res: Response, next: NextFunction) {
  try {
    const roleNames = req.userSession.role.map((role) => role.name);
    if (roleNames?.indexOf(ROLE_LIST.CIVIL_ENGINEER.name) !== -1) {
      next();
    } else {
      const response = new ServiceResponse(
        HttpStatusCodes.FORBIDDEN,
        "Access Denied.",
        null,
        true,
        [new APIError("Access Denied.", ErrorCodes.FORBIDDEN, "jwtToken")]
      );
      return responseBuilder(response, res, next, req);
    }
  } catch (error) {
    Log.error(TAG, "isCivilEngineer()", error);
    next(error);
  }
}

export function isSuperAdminOrCivilEngineer(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const roleNames = req.userSession.role.map((role) => role.name);
    if (
      roleNames?.indexOf(ROLE_LIST.SUPER_ADMIN.name) !== -1 ||
      roleNames?.indexOf(ROLE_LIST.CIVIL_ENGINEER.name) !== -1
    ) {
      next();
    } else {
      const response = new ServiceResponse(
        HttpStatusCodes.FORBIDDEN,
        "Access Denied.",
        null,
        true,
        [new APIError("Access Denied.", ErrorCodes.FORBIDDEN, "jwtToken")]
      );
      return responseBuilder(response, res, next, req);
    }
  } catch (error) {
    Log.error(TAG, "isCivilEngineer()", error);
    next(error);
  }
}

export function isSuperAdminOrCivilEngineerorUser(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const roleNames = req.userSession.role.map((role) => role.name);
    if (
      roleNames?.indexOf(ROLE_LIST.SUPER_ADMIN.name) !== -1 ||
      roleNames?.indexOf(ROLE_LIST.CIVIL_ENGINEER.name) !== -1 ||
      roleNames?.indexOf(ROLE_LIST.USER.name) !== -1
    ) {
      next();
    } else {
      const response = new ServiceResponse(
        HttpStatusCodes.FORBIDDEN,
        "Access Denied.",
        null,
        true,
        [new APIError("Access Denied.", ErrorCodes.FORBIDDEN, "jwtToken")]
      );
      return responseBuilder(response, res, next, req);
    }
  } catch (error) {
    Log.error(TAG, "isCivilEngineer()", error);
    next(error);
  }
}

export async function handleUserActionPermission(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const actions = Object.keys(UserActions);
    const action = req.params[PathParams.ACTION];
    switch (action) {
      case actions[0]:
        isSuperAdmin(req, res, next);
        break;
      case actions[1]:
        isSuperAdmin(req, res, next);
        break;
      case actions[2]:
        isSuperAdmin(req, res, next);
        break;
      case actions[3]:
        isSuperAdmin(req, res, next);
        break;
      case actions[4]:
        isSuperAdmin(req, res, next);
        break;
      case actions[5]:
        isSuperAdmin(req, res, next);
        break;
      case actions[6]:
        isCivilEngineer(req, res, next);
        break;
      case actions[7]:
        isSuperAdmin(req, res, next);
        break;
      default:
        isSuperAdmin(req, res, next);
    }
  } catch (error) {
    Log.error(TAG, "isCivilEngineer()", error);
    next(error);
  }
}
