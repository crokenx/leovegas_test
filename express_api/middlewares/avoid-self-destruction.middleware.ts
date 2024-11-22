import { Response, NextFunction, RequestHandler } from 'express';

import { AuthenticatedRequest } from 'interfaces';
import { User } from 'models';

const avoidSelfDestruction: RequestHandler = async(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const uid = req.uid;
    const id = req.params.id;

    try{
        if(String(uid) === String(id)){
            res.status(403).json({
                ok: false,
                message: 'You do not have permission for this',
            })
            return;
        }

        next();
    }catch(error){
        res.status(500).json({
            ok: false,
            message: 'Something went wrong',
            error,
        })
    }

}

export { avoidSelfDestruction };