import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
    uid?: string;
}