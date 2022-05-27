import { IServiceResponse, IUser, Log, ServiceResponse } from "models";
import { NextFunction, Response } from "express";
import * as MeService from "services/me";
import { userDataMapping } from "helpers/data_mapping/user";
import { responseBuilder } from "helpers/response_builder";
import * as UserService from "services/user";
import { HttpStatusCodes } from "constants/status_codes";

const TAG = "controllers.me";

export async function getMyProfileDetails(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("req.query: ", req.query);
    // Log.debug("Request req: >>>>>>> ", req);
    const userId = req.query.profileId || req.userSession.userId;
    const serviceResponse: IServiceResponse = await UserService.getUserDetails(
      userId
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "getMyProfileDetails()", error);
    next(error);
  }
}

export async function updateMyProfileDetails(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_PARAMS: ", req.params);
    const userId = req.body.profileId || req.userSession?.userId;
    delete req.body.profileId;
    const user: IUser = userDataMapping(req.body, userId, req.userSession);

    Log.debug("user: ", user);
    const serviceResponse: IServiceResponse = await UserService.updateUser(
      req.userSession,
      user
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "updateMyProfileDetails()", error);
    next(error);
  }
}

export async function updateMyProfileImage(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_PARAMS: ", req.params);
    Log.debug("REQUEST_BODY: ", req.file);
    const serviceResponse: IServiceResponse =
      await UserService.updateProfileImage(req, res);
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "updateMyProfileImage()", error);
    next(error);
  }
}

export async function updateMyPassword(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_PARAMS: ", req.params);
    Log.debug("REQUEST_BODY: ", req.body);
    const serviceResponse: IServiceResponse = await MeService.updateMyPassword(
      req.userSession,
      req.body
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "updateMyPassword()", error);
    next(error);
  }
}

export async function addMyIdProof(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_PARAMS: ", req.params);
    Log.debug("REQUEST_BODY: ", req.body);
    const serviceResponse: IServiceResponse = await UserService.addUserIdProof(
      req.userSession,
      req.userSession.userId,
      req.body,
      req.files
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "addMyIdProof()", error);
    next(error);
  }
}

export async function getMyIdProofs(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_PARAMS: ", req.params);
    Log.debug("REQUEST_BODY: ", req.body);
    const serviceResponse: IServiceResponse = await UserService.getIdProofs(
      req.userSession?.userId
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "getMyIdProofs()", error);
    next(error);
  }
}

/*export async function updateUserActions(req: any, res: any, next: NextFunction) {
    try {
        Log.debug('Logged in User: ', req.userSession);
        Log.debug('REQUEST_PARAMS: ', req.params);
        Log.debug('REQUEST_BODY: ', req.body);
        const serviceResponse: IServiceResponse = await UserService.updateUserActions(req.userSession, req.body);
        serviceResponse.data = new ServiceResponse(HttpStatusCodes.OK,
            'User Action Updated successfully.', true);
        responseBuilder(serviceResponse, res, next, req);
    } catch (error) {
        Log.error(TAG, 'updateUserActions()', error);
        next(error);
    }
}*/
