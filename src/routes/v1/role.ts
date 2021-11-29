import * as RoleController from 'controllers/role';
import {Router} from 'express';
import {isAuthenticated} from 'middlewares/authentication';
import {ROOT} from 'constants/api_paths';

const router = Router();
router.use(isAuthenticated);
router.route(ROOT)
    .get(RoleController.getRoles);

export default router;
