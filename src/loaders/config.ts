import { config } from "dotenv";
import { existsSync, mkdirSync } from "fs";
import { AppError, Log } from "models";
import { resolve } from "path";

// TODO: get path from env.
// option to load conf from Param store as well
config({ path: resolve(__dirname, "../../.env") });

export const PORT = process.env.PORT || 8001;
export const JWT_ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || "docity_api";
export const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || "docity_api_refersh";
export const JWT_ACCESS_TOKEN_EXPIRY_TIME =
  process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME || "2h";
export const JWT_REFRESH_TOKEN_EXPIRY_TIME =
  process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME || "30d";
export const CORS_ORIGIN_URLS = process.env.CORS_ORIGIN || "*";
export const SOCKET_SSL_CERT = process.env.SOCKET_SSL_CERT;
export const SOCKET_SSL_KEY = process.env.SOCKET_SSL_KEY;
export const API_CALL_LOG_FORMAT =
  process.env.API_CALL_LOG_FORMAT ||
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]';
export const REQUEST_BODY_LIMIT = +process.env.REQUEST_BODY_LIMIT || 100;
export const CONF_DIR_PATH = +process.env.CONF_DIR_PATH || resolve("./config/");
export const SWAGGER_DOC_PATH =
  process.env.SWAGGER_DOC_PATH || resolve("./oas_doc.yml");
export const AES_ENC_KEY =
  process.env.ASE_ENC_KEY || "bf3c199c2470cb477d907b1e0917c17b";
export const AES_IV = process.env.ASE_IV || "5183666c72eec9e4";
export const SENDER_EMAIL_ID = process.env.SENDER_EMAIL_ID || "";
export const CONTACT_US_RECIPIENT_EMAIL_ID =
  process.env.CONTACT_US_RECIPIENT_EMAIL_ID || "";
export const SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || "";
export const SAVE_FILES = process.env.SAVE_FILES || "uploads";
if (!existsSync(SAVE_FILES)) {
  mkdirSync(SAVE_FILES);
  Log.debug("CREATED FOLDER " + SAVE_FILES);
}
export const API_URL = process.env.API_URL || "http://localhost:" + PORT;

export const AWS_S3 = {
  accessKeyId: process.env.ACCESS_KEY_ID || "",
  secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  acl: process.env.ACL || "",
  userBucket: process.env.USER_BUCKET_NAME || "",
  docBucket: process.env.DOC_BUCKET_NAME || "",
  region: process.env.REGION || "",
};

export const MONGO_DATABASE = {
  URL: process.env.MONGO_URL || "",
  address: process.env.MONGO_DATABASE_ADDRESS || "127.0.0.1",
  port: process.env.DATABASE_PORT || 27017,
  username: encodeURIComponent(process.env.MONGO_DATABASE_USERNAME || ""),
  password: encodeURIComponent(process.env.MONGO_DATABASE_PASSWORD || ""),
  name: process.env.MONGO_DATABASE_NAME || "docity",
};

export const PROFILE_PERCENTAGE = {
  PROFILE_PERCENT_VALUE_1: +(process.env.PROFILE_PERCENT_VALUE_1 ?? 0),
  PROFILE_PERCENT_VALUE_2: +(process.env.PROFILE_PERCENT_VALUE_2 ?? 0),
  PROFILE_PERCENT_VALUE_3: +(process.env.PROFILE_PERCENT_VALUE_3 ?? 0),
  PROFILE_PERCENT_VALUE_4: +(process.env.PROFILE_PERCENT_VALUE_4 ?? 0),
  PROFILE_PERCENT_VALUE_5: +(process.env.PROFILE_PERCENT_VALUE_5 ?? 0),
};

export const REDIRECT_URLS = {
  RESET_PASSWORD: process.env?.RESET_PASSWORD_URL ?? "#",
  VERIFY_USER: process.env?.VERIFY_USER_URL ?? "#",
  RIDIRECT_URL: process.env?.RIDIRECT_URL ?? "#",
  CE_REGESTER_PAGE: process.env?.CE_REGESTER_PAGE ?? "#",
};

export const RAZOR_PAY_CREDS = {
  API_KEY: process.env.RP_API_KEY || "",
  API_KEY_SECRET: process.env.RP_API_KEY_SECRET || "",
  WEB_HOOK_SECRET: process.env.RP_WEB_HOOK_SECRET || "",
};

export async function checkEnv() {
  Log.info("STARTED Validation of env variables!");
  const mandatoryFields = [];
  mandatoryFields.forEach((field) => {
    if (!process.env[field]) {
      throw new AppError(`Required configuration '${field}' is missing`);
    }
  });
}
