import {AUTHENTICATION} from 'constants/app_defaults';
import {NextFunction, Response, Router} from 'express';

const router = Router();

router.route('/')
    .get((req, res, next) => {
        res.send({
            server: 'Docity server is up!!!'
        });
    });
router.route('/authenticate/:authenticate')
    .get((req: any, res: Response, next: NextFunction) => {
        AUTHENTICATION.enabled = req.params.authenticate !== 'false';
        res.status(200).send({message: 'Authentication ' + (AUTHENTICATION.enabled === true ? 'enabled' : 'disabled')});

    });

export default router;
