import {NextFunction, Response} from 'express';
import {IServiceResponse, Log} from 'models';
import * as AssessmentQuestionService from 'services/assessment';
import {responseBuilder} from 'helpers/response_builder';

const TAG = 'controller.assessmentQuestion';

export async function getAssessmentQuestions(req: any, res: Response, next: NextFunction) {
    try {
        const serviceResponse: IServiceResponse = await AssessmentQuestionService.getAssessmentQuestions();
        responseBuilder(serviceResponse, res, next, req);
    } catch (err) {
        Log.error(TAG, 'Error while getting assessment questions', err);
        next(err);
    }
}

export async function saveUserAssessment(req: any, res: Response, next: NextFunction) {
    try {
        Log.debug('LOGGED IN USER: ', req.userSession);
        Log.debug('REQUEST BODY: ', req.body);
        const serviceResponse: IServiceResponse = await AssessmentQuestionService.saveUserAssessment(req.userSession,
            req.body.assessment);
        responseBuilder(serviceResponse, res, next, req);
    } catch (e) {
        Log.error(TAG, 'Error while validating answer', e);
        next(e);
    }
}
