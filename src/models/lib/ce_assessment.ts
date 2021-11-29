import {IAssessmentQuestion} from 'src/models/lib/assessment_question';

export interface ICeAssessment {
    id?: string;
    question: IAssessmentQuestion;
    myAnswer: string;
    isCorrectAnswer: boolean;
}

export class CeAssessment implements ICeAssessment {
    public id?: string;
    public question: IAssessmentQuestion;
    public myAnswer: string;
    public isCorrectAnswer: boolean;

    constructor(question: IAssessmentQuestion,
                myAnswer: string,
                isCorrectAnswer: boolean,
                id?: string) {
        this.question = question;
        this.myAnswer = myAnswer;
        this.isCorrectAnswer = isCorrectAnswer;
        this.id = id;

    }

}
