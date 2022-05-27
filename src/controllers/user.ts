import { IServiceResponse, IUser, IUserSession, Log } from "models";
import { NextFunction, Response } from "express";
import * as UserService from "services/user";
import { userDataMapping } from "helpers/data_mapping/user";
import { responseBuilder } from "helpers/response_builder";
import { reqUsersQueryDataMapping } from "helpers/data_mapping/req_query";
import { PathParams } from "constants/api_params";
import { IUserListApiRequest } from "src/models/lib/api_requests/user_list_api_request";
import user from "data_stores/mongo_db/db_models/user";

const TAG = "controllers.user";

export async function saveUser(req: any, res: Response, next: NextFunction) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_BODY: ", req.body);
    const user: IUser = userDataMapping(req.body, req.userSession);
    const serviceResponse: IServiceResponse = await UserService.saveUser(
      req.userSession,
      user
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "saveUser()", error);
    next(error);
  }
}

export async function getUsers(req: any, res: Response, next: NextFunction) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_QUERY: ", req.query);
    const queryParams: IUserListApiRequest = reqUsersQueryDataMapping(
      req.query
    );
    const serviceResponse: IServiceResponse = await UserService.getUsers(
      req.userSession,
      queryParams
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "getUsers()", error);
    next(error);
  }
}

export async function getCivilEnggList(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    req.query.roles = "CIVIL_ENGINEER";
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_QUERY: ", req.query);
    const dummySession = {
      role: [],
      permissions: [],
      name: "",
    } as IUserSession;
    const queryParams: IUserListApiRequest = reqUsersQueryDataMapping(
      req.query
    );
    Log.debug("queryParams: ", queryParams);
    const serviceResponse: IServiceResponse = await UserService.getUsers(
      dummySession,
      queryParams
    );
    let enggList = [];
    serviceResponse.data.list.forEach((v: any) => {
      enggList.push({
        id: v.id,
        displayName: v.fullName,
        qualification: v.qualification,
      });
    });
    serviceResponse.data = enggList;
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "getUsers()", error);
    next(error);
  }
}

export async function getUser(req: any, res: Response, next: NextFunction) {
  try {
    const userId = req.params[PathParams.USER_ID];
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_PARAMS ", req.params);
    const serviceResponse: IServiceResponse = await UserService.getUserDetails(
      userId
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "getUser()", error);
    next(error);
  }
}

export async function updateUser(req: any, res: Response, next: NextFunction) {
  try {
    const userId = req.params[PathParams.USER_ID];
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_PARAMS: ", req.params);
    Log.debug("REQUEST_BODY: ", req.body);
    const user: IUser = userDataMapping(req.body, userId, req.userSession);
    const serviceResponse: IServiceResponse = await UserService.updateUser(
      req.userSession,
      user
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "getUser()", error);
    next(error);
  }
}

export async function updateProfileImage(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_PARAMS: ", req.params);
    Log.debug("REQUEST_BODY: ", req.body);
    const serviceResponse: IServiceResponse =
      await UserService.updateProfileImage(req, res);
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "updateProfileImage()", error);
    next(error);
  }
}

export async function addUserIdProof(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params[PathParams.USER_ID];
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_PARAMS: ", req.params);
    Log.debug("REQUEST_BODY: ", req.body);
    const serviceResponse: IServiceResponse = await UserService.addUserIdProof(
      req.userSession,
      userId,
      req.body,
      req.files
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "addUserIdProof()", error);
    next(error);
  }
}

export async function getUserIdProofs(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params[PathParams.USER_ID];
    Log.debug("Logged in User: ", req.userSession);
    Log.debug("REQUEST_PARAMS: ", req.params);
    Log.debug("REQUEST_BODY: ", req.body);
    const serviceResponse: IServiceResponse = await UserService.getIdProofs(
      userId
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "getUserIdProofs()", error);
    next(error);
  }
}

export async function handleUserAction(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params[PathParams.USER_ID];
    const action = req.params[PathParams.ACTION];
    Log.debug("Logged in User: ", req.userSession);
    const serviceResponse: IServiceResponse =
      await UserService.handleUserAction(req.userSession, userId, action);
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "updateOverAllStatus()", error);
    next(error);
  }
}

export async function inviteUser(req: any, res: Response, next: NextFunction) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    const role = req.params[PathParams.ROLE];
    const serviceResponse: IServiceResponse = await UserService.inviteUser(
      req.userSession,
      req.body,
      role
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "inviteUser()", error);
    next(error);
  }
}

export async function shareReport(req: any, res: Response, next: NextFunction) {
  try {
    Log.debug("Logged in User: ", req.userSession);
    const userId = req.userSession.userId;
    const role = req.userSession.role;
    const serviceResponse: IServiceResponse = await UserService.shareReport(
      req.userSession,
      req.body,
      role,
      userId
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "shareReport()", error);
    next(error);
  }
}

export async function get() {}
