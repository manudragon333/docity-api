import {AuditInfo, BaseRecord, BaseRecordAudit, IAttachment, IBaseRecordAudit, IUserSession} from 'models';

export interface IUser extends IBaseRecordAudit {
    firstName: string;
    lastName?: string;
    fullName?: string;
    password?: string;
    mobileNumber: string;
    emailId: string;
    role: any[];
    dob?: string;
    idProof?: IAttachment[];
    age?: number;
    countryCode?: string;
    graduateFrom?: string;
    graduationYear?: number;
    currentAddress?: string;
    permanentAddress?: string;
    profileImage?: string;
    temporaryProfileImage?: string;
    kycVerified?: number;
    trainingStatus?: number;
    assessmentStatus?: number;
    profilePercentage?: number;
    status?: number;
    readMessage?: number;
    termsAndConditions?: boolean;
    qualification?: string;
}

export class User extends BaseRecordAudit implements IUser {
    public firstName: string;
    public lastName?: string;
    public fullName?: string;
    public password?: string;
    public mobileNumber: string;
    public emailId: string;
    public role: string[];
    public dob?: string;
    public idProof?: IAttachment[];
    public age?: number;
    public countryCode?: string;
    public graduateFrom?: string;
    public graduationYear?: number;
    public currentAddress?: string;
    public permanentAddress?: string;
    public profileImage?: string;
    public temporaryProfileImage?: string;
    public kycVerified?: number;
    public trainingStatus?: number;
    public assessmentStatus?: number;
    public profilePercentage?: number;
    public status?: number;
    public readMessage?: number;
    public termsAndConditions?: boolean;
    public qualification?: string;

    constructor(
        loggedInUser: IUserSession,
        firstName: string,
        mobileNumber: string,
        emailId: string,
        role: string[],
        lastName?: string,
        password?: string,
        dob?: string,
        idProof?: IAttachment[],
        age?: number,
        countryCode?: string,
        graduateFrom?: string,
        graduationYear?: number,
        currentAddress?: string,
        permanentAddress?: string,
        termsAndConditions?: boolean,
        qualification?: string,
        profileImage?: string,
        temporaryProfileImage?: string,
        kycVerified?: number,
        trainingStatus?: number,
        assessmentStatus?: number,
        profilePercentage?: number,
        status?: number,
        readMessage?: number,
        id?: string) {
        super(
            id,
            null,
            new AuditInfo(
                new BaseRecord(
                    loggedInUser.userId,
                    loggedInUser?.name,
                ),
                new Date(),
                new BaseRecord(
                    loggedInUser.userId,
                    loggedInUser?.name,
                ),
                new Date(),
            )
        );
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + (lastName ? ' ' + lastName : '');
        this.password = password;
        this.mobileNumber = mobileNumber;
        this.emailId = emailId;
        this.termsAndConditions = termsAndConditions;
        this.role = role;
        this.dob = dob;
        this.idProof = idProof;
        this.age = age;
        this.countryCode = countryCode;
        this.graduateFrom = graduateFrom;
        this.graduationYear = graduationYear;
        this.currentAddress = currentAddress;
        this.permanentAddress = permanentAddress;
        this.profileImage = profileImage;
        this.temporaryProfileImage = temporaryProfileImage;
        this.kycVerified = kycVerified;
        this.trainingStatus = trainingStatus;
        this.assessmentStatus = assessmentStatus;
        this.profilePercentage = profilePercentage;
        this.status = status;
        this.readMessage = readMessage;
        this.qualification = qualification;
    }

}
