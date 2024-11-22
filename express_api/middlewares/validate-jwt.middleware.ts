import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction, RequestHandler } from 'express';

import { AuthenticatedRequest } from 'interfaces';
import { User } from 'models';


const validateJWT: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Get token
    const token = req.header('x-token');

    if ( !token ) {
        res.status(401).json({
            ok: false,
            msg: 'There is not token on petition'
        });
        return;
    }

    try {    
        const { uid } = jwt.verify(token!, process.env.JWT_SECRET!) as JwtPayload;
        req.uid = uid;

        next();
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        });
    }
 
}

const validateAdminRole: RequestHandler = async(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const uid = req.uid;

    try{
        const usuarioDb = await User.findByPk(uid);     

        if(!usuarioDb){
            res.status(404).json({
                ok: false,
                message: 'User does not exist',
            });
            return;
        }

        if(usuarioDb!.toJSON().role !== 'ADMIN'){
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

const validateAdminRoleSelfUser: RequestHandler = async(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const uid = req.uid;
    const id = req.params.id;

    try{
        const usuarioDb = await User.findByPk(uid);     

        if( !usuarioDb ){
            res.status(404).json({
                ok: false,
                message: 'User with provided id does not exist',
            });
            return;
        }

        if(usuarioDb!.toJSON().role === 'ADMIN' || String(uid) === String(id)){
            next();
        } else {
            res.status(403).json({
                ok: false,
                message: 'You do not have permission for this',
            });
        }
    }catch(error){
        res.status(500).json({
            ok: false,
            message: 'Something went wrong',
            error,
        })
    }

}

export { validateJWT, validateAdminRole, validateAdminRoleSelfUser }