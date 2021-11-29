import * as MediaController from 'controllers/media';
import {Router} from 'express';
import {isAuthenticated} from 'middlewares/authentication';
import {MEDIA_ROUTES} from 'constants/api_paths';

const router = Router();
router.use(isAuthenticated);

router.route(MEDIA_ROUTES.USER_FILES)
    .get(MediaController.fetchUserAttachmentFromS3);
router.route(MEDIA_ROUTES.PROPERTY_FILES)
    .get(MediaController.fetchPropertyAttachmentFromS3);

export default router;
