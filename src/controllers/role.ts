import {NextFunction, Response} from 'express';
import {IServiceResponse, Log} from 'models';
import * as RoleService from 'services/role';
import {responseBuilder} from 'helpers/response_builder';

const TAG = 'controllers.role';

export async function getRoles(req: any, res: Response, next: NextFunction) {
    try {
        const response: IServiceResponse = await RoleService.getRoles(req.query);
        responseBuilder(response, res, next, req);
    } catch (error) {
        Log.error(TAG, 'getRoles', error);
        next(error);
    }
}
