import {PathParams} from 'constants/api_params';

export const ROOT = '/';
export const ROUTER_USER = '/users';
export const ROUTER_AUTH = '/auth';
export const ROUTER_ME = '/me';
export const ROUTE_MASTER_DATA = '/masterData';
export const ROUTER_PROPERTY_REQUEST = '/propertyRequests';
export const ROUTER_ROLE = '/roles';
export const RUTE_ASSESSMENT_QUESTION_REQUEST = '/assessments';
export const ROUTER_MEDIA = '/files';
export const ROUTER_PAYMENTS = '/payments';
export const ROUTER_CONTACT_US = '/contact';

const USER_INSTANCE = `/:${PathParams.USER_ID}`;
export const USER_PATHS = {
    USER_INSTANCE: USER_INSTANCE,
    UPDATE_STATUS: `${USER_INSTANCE}/actions/:${PathParams.ACTION}`,
    PROFILE_IMAGE: USER_INSTANCE + '/profileImage',
    ATTACHMENT: USER_INSTANCE + '/attachments',
    INVITE_USER: `/invite/:${PathParams.ROLE}`,
    SHARE_REPORT: `/shareReport/`
};

export const AUTH_PATHS = {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGET_PASSWORD: '/forgetPassword',
    RESET_PASSWORD: '/resetPassword',
    VERIFY_USER: '/verify/',
    RESEND_VERIFY_LINK: '/resend/verifyLink',
    VERIFY_INVITE_USER_TOKEN: '/invite/verify',
    SAVE_INVITE_USER_DETAILS: '/users',
    REFRESH_SESSION: '/refreshSession',
    VALIDATE_EMAIL: '/validateEmail',
};

export const ME_PATHS = {
    RESET_PASSWORD: '/resetPassword',
    PROFILE_IMAGE: '/profileImage',
    ATTACHMENT: '/attachments',
    UPDATE_ACTIONS: '/actions'
};

export const MASTER_DATA_PATHS = {
    REGIONS: '/regions',
    PROPERTY_TYPES: '/propertyTypes',
    UPLOAD_TYPES: '/documentTypes',
    QUERY_TYPES:'/queryTypes',
    ASSESSMENT_QUESTIONS: '/assessmentQuestions'
};

export const ASSESSMENT_QUESTION_PATHS = {
    ASSESSMENT_QUESTIONS: '/questions',
    SUBMIT_ASSESSMENT: '/submit'
};

const PROPERTY_INSTANCE = `/verifyRequests/:${PathParams.PROPERTY_REQUEST_ID}`;
export const PROPERTY_REQUEST = {
    PROPERTY_INSTANCE: PROPERTY_INSTANCE,
    ADD_REQUEST: '/verifyRequests',
    GET_REQUEST_LOCATIONS: '/verifyRequests/locations',
    UPLOAD_DOCUMENTS: `${PROPERTY_INSTANCE}/docs`,
    LINK_PROPERTY_DOCUMENTS: `${PROPERTY_INSTANCE}/docs/:${PathParams.PROPERTY_CHAT_ID}`,
    UPLOAD_FINAL_REPORT: `${PROPERTY_INSTANCE}/finalReport`,
    SHARE_FINAL_REPORT: `${PROPERTY_INSTANCE}/finalReport/share`,
    CONTACT: '/contacts',
    DOCUMENT_INSTANCE: `${PROPERTY_INSTANCE}/docs/:${PathParams.PROPERTY_DOC_ID}`,
    UPDATE_DOCUMENT_WRITER: `${PROPERTY_INSTANCE}/documentWriter`,
    ADD_CIVIL_ENGINEER: `${PROPERTY_INSTANCE}/civilEngineers`,
    UPDATE_CIVIL_ENGINEER_ACTION: `${PROPERTY_INSTANCE}/civilEngineers/actions/:${PathParams.ACTION}`,
    UPDATE_STATUS: `${PROPERTY_INSTANCE}/actions/:${PathParams.ACTION}`,
    DOCUMENT_COMMENTS: `${PROPERTY_INSTANCE}/docs/:${PathParams.PROPERTY_DOC_ID}/comments`,
    DOCUMENT_COMMENT_INSTANCE: `${PROPERTY_INSTANCE}/docs/:${PathParams.PROPERTY_DOC_ID}/comments/:${PathParams.COMMENT_ID}`,
};

export const MEDIA_ROUTES = {
    USER_FILES: `/userFiles/:${PathParams.MEDIA_ID}`,
    PROPERTY_FILES: `/propertyFiles/:${PathParams.MEDIA_ID}`,
};

export const PAYMENT_ROUTES = {
    PROPERTY_REQUEST: '/propertyRequests',
    PROPERTY_REQUEST_BY_ID: `/propertyRequests/:${PathParams.PROPERTY_REQUEST_ID}`,
    PROPERTY_REQUEST_UPDATE: '/propertyRequests/upgrade',
    PROPERTY_REQUEST_CAPTURE: '/propertyRequests/capture',
};

export const CONTACT_US_PATHS = {
    CONTACT_US: '/contactUs',
};