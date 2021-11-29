import {NextFunction, Response} from 'express';
import {IServiceResponse, Log} from 'models';
import * as MasterService from 'services/masterdata';
import {responseBuilder} from 'helpers/response_builder';
import {reqGetAllRegionsQueryDataMapping} from 'helpers/data_mapping/req_query';

const TAG = 'controller.masterdata';

export async function getAllRegions(req: any, res: Response, next: NextFunction) {
    try {
        const queryParam = reqGetAllRegionsQueryDataMapping(req.query);
        const serviceResponse: IServiceResponse = await MasterService.getAllRegions(queryParam);
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'Error while getting all regions', err);
        next(err);
    }
}

export async function getAllPropertyTypes(req: any, res: Response, next: NextFunction) {

    try {
        const serviceResponse: IServiceResponse = await MasterService.getAllPropertyTypes();
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'Error while getting property types', err);
        next(err);
    }

}

export async function getQueryTypes(req: any, res: Response, next: NextFunction) {

    try {
        const serviceResponse: IServiceResponse = await MasterService.getQueryTypes();
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'error while getting upload types', err);
        next(err);
    }
}

export async function getDocumentTypes(req: any, res: Response, next: NextFunction) {

    try {
        const serviceResponse: IServiceResponse = await MasterService.getDocumentTypes();
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'error while getting upload types', err);
        next(err);
    }
}
