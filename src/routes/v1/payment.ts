import * as PaymentController from 'controllers/payment';
import * as PaymentValidation from 'validations/payment';
import {Router} from 'express';
import {PAYMENT_ROUTES} from 'constants/api_paths';
import {isAuthenticated} from 'middlewares/authentication';

const router = Router();

router.route(PAYMENT_ROUTES.PROPERTY_REQUEST)
    .post(isAuthenticated, PaymentValidation.createPaymentOrder, PaymentController.createPaymentOrder);
router.route(PAYMENT_ROUTES.PROPERTY_REQUEST_BY_ID)
    .get(isAuthenticated, PaymentController.getPropertyRequestLastPaymentRecord);
router.route(PAYMENT_ROUTES.PROPERTY_REQUEST_UPDATE)
    .post(PaymentController.updatePaymentOrder);
router.route(PAYMENT_ROUTES.PROPERTY_REQUEST_CAPTURE)
    .post(isAuthenticated,  PaymentValidation.capturePayment, PaymentController.capturePayment);

export default router;
