export interface IAssessmentQuestion {
    options?: string;
    question?: string;
    id?: string;
    questionType?: string;
    answer?: object;
}

export class AssessmentQuestion implements IAssessmentQuestion {
    public id?: string;
    public question?: string;
    public options?: string;
    public questionType?: string;
    public answer?: object;

    constructor(id?: any, question?: any, options?: any, questionType?: any, answer?: object) {
        this.id = id?.toString();
        this.question = question;
        this.options = options;
        this.questionType = questionType;
        this.answer = answer;
    }
}
