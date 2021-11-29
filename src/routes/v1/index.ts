import { Router } from "express";

const router = Router();
import DummyRoutes from "./dummy";
import {
  ROOT,
  ROUTER_USER,
  ROUTER_AUTH,
  ROUTER_ME,
  ROUTE_MASTER_DATA,
  ROUTER_PROPERTY_REQUEST,
  ROUTER_ROLE,
  RUTE_ASSESSMENT_QUESTION_REQUEST,
  ROUTER_MEDIA,
  ROUTER_PAYMENTS,
  ROUTER_CONTACT_US,
} from "constants/api_paths";
import UserRoutes from "./user";
import AuthRoutes from "./auth";
import MeRoutes from "./me";
import MasterDataRoutes from "./masterdata";
import PropertyRequests from "./property_request";
import RoleRoutes from "./role";
import AssessmentQuestionRequests from "./assessment";
import MediaRoutes from "./media";
import PaymentRoutes from "./payment";
import ContactRoutes from "./contact_us";

router.use(ROOT, DummyRoutes);
router.use(ROUTER_USER, UserRoutes);
router.use(ROUTER_AUTH, AuthRoutes);
router.use(ROUTER_ME, MeRoutes);
router.use(ROUTE_MASTER_DATA, MasterDataRoutes);
router.use(ROUTER_PROPERTY_REQUEST, PropertyRequests);
router.use(ROUTER_ROLE, RoleRoutes);
router.use(RUTE_ASSESSMENT_QUESTION_REQUEST, AssessmentQuestionRequests);
router.use(ROUTER_MEDIA, MediaRoutes);
router.use(ROUTER_PAYMENTS, PaymentRoutes);
router.use(ROUTER_CONTACT_US, ContactRoutes);

export default router;
