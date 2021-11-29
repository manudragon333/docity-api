import HandleBars from 'handlebars';
import {CONF_DIR_PATH} from 'loaders/config';
import {Log} from 'models';
import * as fs from 'fs';

const TEMPLATES_DIR_PATH = CONF_DIR_PATH + '/templates';

const compiledTemplates: any = {};
const TAG = 'loaders.template';

export function loadTemplates() {
    Log.info(`${TAG}.loadTemplates()`);
    Log.debug(`STARTED compiling the handlebar html templates.`);
    try {
        if (Object.keys(compiledTemplates).length > 0) {
            return compiledTemplates;
        }
        compiledTemplates.CONTACT_ME = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/contactMeTemplate.html').toString());
        compiledTemplates.INVITATION = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/invitationTemplate.html').toString());
        compiledTemplates.CONTACT_US = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/contactUsTemplate.html').toString());
        compiledTemplates.FINALREPORT = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/finalReportTemplate.html').toString());
        compiledTemplates.PAYMENT_PROCESSING = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/paymentProcessing.html').toString());
        compiledTemplates.PAYMENT_RECIEPT = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/paymentReceipt.html').toString());
        compiledTemplates.SHARED_DOCS = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/shareDocs.html').toString());
        compiledTemplates.ADD_USER = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/addUserTemplate.html').toString());
        compiledTemplates.RESET_PASSWORD = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/resetPasswordTemplate.html').toString());
        compiledTemplates.VERIFY_USER = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/verifyUserTemplate.html').toString());
        compiledTemplates.SHARE_REPORT = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/shareReportTemplate.html').toString());
        compiledTemplates.ADD_CONTACT_US = HandleBars.compile(fs.readFileSync(TEMPLATES_DIR_PATH + '/addContactUsTemplate.html').toString());
    } catch (error) {
        Log.error(TAG, `loadTemplates()`, error);
        throw error;
    }
}
