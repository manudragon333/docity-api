import { Router } from "express";
import {
  ASSESSMENT_QUESTION_PATHS,
  RUTE_ASSESSMENT_QUESTION_REQUEST,
} from "constants/api_paths";
import * as AssessmentQuestionController from "controllers/assessment";
import * as AssessmentRequestValidation from "validations/assessment";
import { isAuthenticated } from "middlewares/authentication";
import {
  isCivilEngineer,
  isSuperAdminOrCivilEngineer,
} from "middlewares/permission";

const router = Router();
router.use(isAuthenticated);

router
  .route(ASSESSMENT_QUESTION_PATHS.ASSESSMENT_QUESTIONS)
  .get(
    isSuperAdminOrCivilEngineer,
    AssessmentQuestionController.getAssessmentQuestions
  );
router
  .route(ASSESSMENT_QUESTION_PATHS.SUBMIT_ASSESSMENT)
  .post(
    isCivilEngineer,
    AssessmentRequestValidation.submitAssessment,
    AssessmentQuestionController.saveUserAssessment
  );

export default router;
