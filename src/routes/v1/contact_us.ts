import * as ContactUsController from "controllers/contact_us";
import * as ContactUsValidation from "validations/contact_us";
import { Router } from "express";
import { CONTACT_US_PATHS } from "constants/api_paths";

const router = Router();

router
  .route(CONTACT_US_PATHS.CONTACT_US)
  .post(ContactUsValidation.contactUs, ContactUsController.saveContactUs);

export default router;
