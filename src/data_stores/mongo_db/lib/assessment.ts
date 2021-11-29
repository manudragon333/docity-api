import { ICeAssessment, Log } from "models";
import Assessment_question from "../db_models/assessment_questions";
import {
  findAllRecords,
  findOneAndUpdate,
} from "data_stores/mongo_db/helpers/query";
import {
  AssessmentQuestion,
  IAssessmentQuestion,
} from "src/models/lib/assessment_question";
import CEAssessment from "../db_models/ce_assessment";
import User from "../db_models/user";
import { STATUS_LIST } from "constants/master_data";

const TAG = "data_stores.mongo_db.lib.assessmentQuestion";

export async function getAssessmentQuestions(
  answerRequired: boolean = false
): Promise<IAssessmentQuestion[]> {
  Log.info(TAG, "Getting assessment questions");
  try {
    const assessmentQuestions = await findAllRecords(
      Assessment_question,
      {},
      {
        _id: 1,
        assessment_question: 1,
        question_type: 1,
        options: 1,
        actual_answer: 1,
      },
      {},
      []
    );
    const assessmentQuestionsList: IAssessmentQuestion[] = [];
    for (const assessmentQuestion of assessmentQuestions) {
      if (!answerRequired) {
        delete assessmentQuestion.actual_answer;
      }
      assessmentQuestionsList.push(
        new AssessmentQuestion(
          assessmentQuestion?._id,
          assessmentQuestion?.assessment_question,
          assessmentQuestion.options,
          assessmentQuestion?.question_type,
          assessmentQuestion.actual_answer
        )
      );
    }
    return assessmentQuestionsList;
  } catch (err) {
    Log.error(TAG, "getAssessmentQuestions()", err);
    throw err;
  }
}

export async function saveUserAssessmentAnswers(
  userId: string,
  answers: ICeAssessment[]
) {
  try {
    const docs = [];
    for (const doc of answers) {
      docs.push({
        user_id: userId,
        question: {
          _id: doc.question.id,
          assessment_question: doc.question.question,
          options: doc.question.options,
          question_type: doc.question.questionType,
          actual_answer: doc.question.answer,
        },
        answer: doc.myAnswer,
        is_correct_answer: doc.isCorrectAnswer,
      });
    }
    return await CEAssessment.insertMany(docs);
  } catch (e) {
    Log.error(TAG, "saveUserAssessmentAnswers()", e);
    throw e;
  }
}

export async function updateUserAssessment(userId: string, marks: number) {
  try {
    return await findOneAndUpdate(
      User,
      {
        _id: userId,
      },
      {
        $set: {
          assessment_marks: marks,
          assessment: STATUS_LIST["6"].id,
        },
      }
    );
  } catch (e) {
    Log.error(TAG, "updateUserMarks()", e);
    throw e;
  }
}
