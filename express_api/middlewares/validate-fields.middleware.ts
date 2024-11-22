import { RequestHandler, response } from 'express';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validateFields: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
        console.log(`[error]: some fields were not provided`);
        return;
    }

    next();
}

export { validateFields };