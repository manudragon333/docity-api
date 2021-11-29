import {
    APIError,
    CeAssessment,
    ICeAssessment,
    IServiceResponse,
    IUserSession,
    ListAPIResponse,
    Log,
    ServiceResponse
} from 'models';
import * as AssessmentQuestion from 'data_stores/mongo_db/lib/assessment';
import {HttpStatusCodes} from 'constants/status_codes';
import {IAssessmentQuestion} from 'src/models/lib/assessment_question';
import {fetchUserDetails} from 'data_stores/mongo_db/lib/user';
import {ErrorCodes} from 'constants/error_constants';
import {STATUS_LIST} from "constants/master_data";

const TAG = 'service.assessmentQuestion';

export async function getAssessmentQuestions() {

    Log.info(TAG, 'Get assessment questions');
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'upload types fetched successfully', false);
    try {
        const result = await AssessmentQuestion.getAssessmentQuestions();
        serviceResponse.data = new ListAPIResponse(result);
    } catch (err) {
        Log.error(TAG, 'error while getting assessment questions', err);
        throw err;
    }
    return serviceResponse;
}

export async function saveUserAssessment(loggedInUser: IUserSession, payload: any[]) {
    Log.info(TAG, 'Validating answer');
    const serviceResponse: IServiceResponse =
        new ServiceResponse(HttpStatusCodes.OK, 'Assessment completed', true);
    try {
        const user = await fetchUserDetails(loggedInUser?.userId);
        if (user.assessmentStatus === STATUS_LIST['6'].id) {
            serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
            serviceResponse.message = 'You already took the assessment!';
            serviceResponse.addError(new APIError('You already took the assessment.',
                ErrorCodes.RESOURCE_ALREADY_EXIST, 'assessment'));
        } else {
            const actualQuestionAndAnswers: IAssessmentQuestion[] =
                await AssessmentQuestion.getAssessmentQuestions(true);
            const userAssessment: ICeAssessment[] = [];
            let totalMarks = 0;
            for (const userAnswer of payload) {
                const actualAnswer = await actualQuestionAndAnswers.filter((aQuestion) =>
                    aQuestion.id == userAnswer.question.id)[0];
                if (actualAnswer) {
                    const isCorrectAnswer = actualAnswer.answer == userAnswer.answer;
                    userAssessment.push(new CeAssessment(
                        actualAnswer,
                        userAnswer.answer,
                        isCorrectAnswer,
                    ));
                    totalMarks += +isCorrectAnswer;
                }

            }
            await AssessmentQuestion.saveUserAssessmentAnswers(loggedInUser.userId, userAssessment);
            await AssessmentQuestion.updateUserAssessment(loggedInUser.userId, totalMarks);
        }
    } catch
        (e) {
        Log.error(TAG, 'Error while validating answer', e);
        serviceResponse.addServerError('Failed to save answers due to technical issues.');
    }
    return serviceResponse;
}
