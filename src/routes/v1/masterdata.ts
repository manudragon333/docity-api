import {Router} from 'express';
import {MASTER_DATA_PATHS} from 'constants/api_paths';
import * as MasterDataController from 'controllers/masterdata';
import * as MasterDataValidation from 'validations/master_data';

const router = Router();

router.route(MASTER_DATA_PATHS.REGIONS)
    .get(MasterDataValidation.getAllRegions, MasterDataController.getAllRegions);
router.route(MASTER_DATA_PATHS.PROPERTY_TYPES)
    .get(MasterDataController.getAllPropertyTypes);

router.route(MASTER_DATA_PATHS.QUERY_TYPES)
    .get(MasterDataController.getQueryTypes);

router.route(MASTER_DATA_PATHS.UPLOAD_TYPES)
    .get(MasterDataController.getDocumentTypes);

export default router;
