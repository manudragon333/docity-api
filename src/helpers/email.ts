import {emailClientLoader} from 'loaders/email_client';

import {IEmailRecipient, IEmailSender, Log} from 'models';

const TAG = 'helpers.email';

export async function sendEmail(emailSender: IEmailSender, emailRecipient: IEmailRecipient, subject: string,
                                body: string, attachments?: any[]) {
    Log.info(`${TAG}.sendEmail()`);
    try {
        const emailClient = emailClientLoader();
        // TODO set params as per the email client and send email.
        return await emailClient.sendMail({
            from: emailSender.emailId,
            to: emailRecipient.toEmailIds,
            cc: emailRecipient?.ccEmailIds ?? [],
            bcc: emailRecipient?.bccEmailIds ?? [],
            subject: subject,
            html: body,
            attachments: attachments,
        });
    } catch (error) {
        Log.error(TAG, `sendEmail()`, error);
        throw error;
    }
}
