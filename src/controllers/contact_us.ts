import { IServiceResponse, IUser, Log } from "models";
import { NextFunction, Response } from "express";
import * as ContactUsService from "services/contact_us";
import { userDataMapping } from "helpers/data_mapping/user";
import { responseBuilder } from "helpers/response_builder";
import { reqUsersQueryDataMapping } from "helpers/data_mapping/req_query";
import { PathParams } from "constants/api_params";
import { IUserListApiRequest } from "src/models/lib/api_requests/user_list_api_request";
import user from "data_stores/mongo_db/db_models/user";

const TAG = "controller.contactUs";

export async function saveContactUs(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    Log.info("req.boby contactus:", req.boby);
    const serviceResponse: IServiceResponse = await ContactUsService.contactUs(
      req.body
    );
    responseBuilder(serviceResponse, res, next, req);
  } catch (error) {
    Log.error(TAG, "contactUs() error", error);
    next(error);
  }
}
