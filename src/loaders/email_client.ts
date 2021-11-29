import { SENDER_EMAIL_ID, SENDER_EMAIL_PASSWORD } from "loaders/config";
import * as nodeMailer from "nodemailer";
import { Log } from "models";

const TAG = "loaders.email_client";
let emailClient;

export function emailClientLoader() {
  Log.info(TAG + ".getEmailClientInstance()");
  try {
    if (emailClient) {
      return emailClient;
    }
    // TODO create email instance based on the service
    emailClient = nodeMailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL_ID,
        pass: SENDER_EMAIL_PASSWORD,
      },
    });
  } catch (error) {
    Log.error(TAG, "getEmailClientInstance()", error);
    throw error;
  }
}
